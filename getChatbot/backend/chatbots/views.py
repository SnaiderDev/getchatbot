import pickle
import shutil
import httpx
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from openai import OpenAI
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from chatbots.utils import OllamaClient, extraer_texto_web, leer_pdf
from chatbots.models import UserChatbot
import tempfile
import json
import os
import base64

# Create a custom HTTP client with SSL verification disabled
transport = httpx.HTTPTransport(verify=False)
http_client = httpx.Client(transport=transport)
client = OpenAI(http_client=http_client)

# model = SentenceTransformer(r"C:\Users\ljpastra\Documents\generador-chatbots-BC\all-MiniLM-L6-v2")
# CSRF exemption is added to allow these views to be accessed without CSRF tokens
@csrf_exempt    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def train_chatbot(request):
    user = request.user.id
    name = request.data.get('name')
    data_source = request.data.get('data_source')
    source_content = request.data.get('sourceContent')
    icon = request.data.get('icon')
    icon_image = request.FILES.get('icon_image')
    starter_messages = request.data.get('starter_messages', '{}')
    quick_actions = request.data.get('quick_actions', '{}')
    descripcion = request.data.get('descripcion')
    theme = request.data.get('theme')
    file = request.FILES.get('document')

    # Validate required fields
    if not name or not data_source:
        return Response({"error": "Missing required fields."}, status=400)

    # Extract content
    content = None
    if data_source == 'text':
        content = source_content

    elif data_source == 'document' and file:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            for chunk in file.chunks():
                temp_file.write(chunk)
            temp_path = temp_file.name

        try:
            content = leer_pdf(temp_path)
        except Exception as e:
            return Response({"error": f"Error reading PDF: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            os.unlink(temp_path)

    elif data_source == 'webpage' and source_content:
        try:
            content_dict = extraer_texto_web(source_content)
            content = list(content_dict)
        except Exception as e:
            return Response({"error": f"Error extracting webpage content: {str(e)}"}, status=500)

    if not content:
        return Response({"error": "No valid content provided for chatbot training."}, status=400)

    # Split content into chunks
    chunk_size, chunk_overlap = 1000, 200
    raw_chunks = [content[i:i + chunk_size] 
              for i in range(0, len(content), chunk_size - chunk_overlap)]

    # --- after: turn each chunk (a list of strings) into one big string ---
    docs = ["\n".join(chunk) for chunk in raw_chunks]
    try:
        response = client.embeddings.create(
            model="text-embedding-ada-002",
            input=docs,
            encoding_format= "float"
        )
        embeddings = [item.embedding for item in response.data]

    except Exception as e:
        return Response({"error": f"OpenAI embedding failed: {str(e)}"}, status=500)

    if not embeddings:
        return Response({"error": "Empty embeddings returned by OpenAI."}, status=500)

    model_path = f"./models/{user}/{name}"
    os.makedirs(model_path, exist_ok=True)

    with open(os.path.join(model_path, "embeddings.pkl"), "wb") as f:
        pickle.dump({"embeddings": embeddings, "docs": docs}, f)

    # Save to DB
    user_chatbot = UserChatbot(
        user_id=user,
        name=name,
        vector_store_path=model_path,
        data_source=data_source,
        icon=icon,
        theme=theme,
        descripcion=descripcion
    )

    if icon_image:
        user_chatbot.icon_image = icon_image.read()

    try:
        user_chatbot.quick_actions = json.loads(quick_actions)
    except json.JSONDecodeError:
        user_chatbot.quick_actions = {}

    try:
        user_chatbot.starter_messages = json.loads(starter_messages)
    except json.JSONDecodeError:
        user_chatbot.starter_messages = {}

    user_chatbot.save()

    return Response({"message": f"El Chatbot '{name}' fue creado exitosamente!"}, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def interact_with_chatbot(request):
    """
    Expect JSON body:
      {
        "message": "<user message>",
        "chatbot_id": <int>
      }
    Requires a valid JWT in Authorization header.
    """
    message = request.data.get('message')
    chatbot_id = request.data.get('chatbot_id')

    if not message or chatbot_id is None:
        return Response(
            {"error": "Both 'message' and 'chatbot_id' are required."},
            status=400
        )

    user = request.user.id
    try:
        user_chatbot = UserChatbot.objects.get(user_id=user, id=chatbot_id)
    except UserChatbot.DoesNotExist:
        return Response(
            {"error": "No chatbot found for this user. Train the chatbot first."},
            status=404
        )

    #Load embeddings and documents
    vector_store_path = user_chatbot.vector_store_path
    with open(os.path.join(vector_store_path, "embeddings.pkl"), "rb") as f:
        db = pickle.load(f)
        db_embeddings = np.array(db["embeddings"])
        db_docs = db["docs"]

    # Embed user message using OpenAI Embedding API
    try:
        embedding_response = client.embeddings.create(
            model="text-embedding-ada-002",
            input=[message],
        )
        user_embedding = embedding_response.data[0].embedding
    except Exception as e:
        return Response(
            {"error": f"OpenAI embedding for message failed: {str(e)}"},
            status=500
        )

    # Compute similarity between user message and stored embeddings
    similarities = cosine_similarity([user_embedding], db_embeddings)[0]
    top_k = 3
    top_indices = similarities.argsort()[-top_k:][::-1]
    top_docs = [db_docs[i] for i in top_indices]

    # Build the prompt for chat completion
    separator = "\n---\n"
    context = separator.join(top_docs)
    messages = [
        {
            "role": "system",
            "content": "Eres un asistente útil que responde con base en el contexto proporcionado."
        },
        {
            "role": "user",
            "content": f"Contexto:\n{context}\n\nUsuario: {message}"
        }
    ]

    # Call the Chat API
    try:
        completion = client.chat.completions.create(
            model="gpt-4",  # or "gpt-3.5-turbo"
            messages=messages,
            temperature=0.3,
            max_tokens=512,
        )
        reply = completion.choices[0].message.content.strip()
    except Exception as e:
        return Response(
            {"error": f"OpenAI response failed: {str(e)}"},
            status=500
        )

    return Response({"reply": reply}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_chatbots(request):
    user = request.user

    chatbots = UserChatbot.objects.filter(user_id=user.id)

    if not chatbots.exists():
        return JsonResponse({"error": "No chatbots found for this user."}, status=404)

    chatbot_list = [
        {
            "id": chatbot.id,
            "name": chatbot.name,
            "vector_store_path": chatbot.vector_store_path,
            "descripcion": chatbot.descripcion
        } for chatbot in chatbots
    ]

    return JsonResponse({"chatbots": chatbot_list})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specific_chatbot(request):
    chatbot_id = request.GET.get('chatbot_id')

    if not chatbot_id:
        return Response({"error": "chatbot_id is required."}, status=400)

    user_id = request.user.id  # ⬅️ This is the real user from the JWT

    try:
        chatbot = UserChatbot.objects.get(id=chatbot_id, user_id=user_id)
    except UserChatbot.DoesNotExist:
        return Response({"error": "No chatbot found with this id."}, status=404)

    icon_image_base64 = None
    if chatbot.icon_image:
        try:
            icon_image_base64 = base64.b64encode(chatbot.icon_image).decode('utf-8')
        except Exception:
            icon_image_base64 = None

    chatbot_info = {
        "id": chatbot.id,
        "name": chatbot.name,
        "icon": chatbot.icon,
        "icon_image": icon_image_base64,
        "starter_messages": chatbot.starter_messages,
        "quick_messages": chatbot.quick_actions,
        "theme": chatbot.theme
    }

    return Response({"chatbot": chatbot_info}, status=200)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_chatbot(request, chatbot_id):
    try:
        chatbot = UserChatbot.objects.get(id=chatbot_id, user_id=request.user.id)
        chatbot.delete()
        # Optionally, delete the model files from the filesystem
        model_path = chatbot.vector_store_path
        if os.path.exists(model_path):
            shutil.rmtree(model_path)
        return Response({"message": "Chatbot eliminado correctamente."}, status=200)
    except UserChatbot.DoesNotExist:
        return Response({"error": "Chatbot no encontrado o no autorizado."}, status=404)