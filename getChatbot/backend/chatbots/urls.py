from django.urls import path
from .views import delete_chatbot, train_chatbot, interact_with_chatbot, \
    get_user_chatbots, get_specific_chatbot

urlpatterns = [
    path('chatbot-train/', train_chatbot, name='chatbot_train'),
    path('chatbot-interact/', interact_with_chatbot, name='chatbot_interact'),
    path('user-chatbots/', get_user_chatbots, name='user_chatbots'),
    path('get-specific-chatbot/', get_specific_chatbot, name='get_specific_chatbot'),
    path('chatbot/<int:chatbot_id>/delete/', delete_chatbot, name='delete_chatbot'),
]
