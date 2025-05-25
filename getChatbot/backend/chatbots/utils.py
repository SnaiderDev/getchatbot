
import os
import pickle
from turtle import pd
from urllib.parse import urljoin, urlparse
import PyPDF2
from bs4 import BeautifulSoup
import faiss
import numpy as np
import requests
from sentence_transformers import SentenceTransformer
import tiktoken
from typing import List

class OllamaClient:
    def __init__(self, base_url="http://localhost:11434/api/generate", model="gemma3-4b"):
        self.base_url = base_url
        self.model = model

    def ask(self, prompt):
        data = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        try:
            response = requests.post(self.base_url, json=data, headers={"Content-Type": "application/json"})
            response.raise_for_status()
            result = response.json()
            return result.get("response", "No response received")
        except requests.exceptions.RequestException as e:
            return f"Error en la solicitud a Ollama: {str(e)}"
def leer_pdf(ruta_pdf):
    textos = []
    with open(ruta_pdf, "rb") as archivo:
        lector = PyPDF2.PdfReader(archivo)
        for pagina in range(len(lector.pages)):
            textos.append(lector.pages[pagina].extract_text())
    return textos

def extraer_texto_web(url: str, mode: str = "single"):
    """
    Extracts text from a webpage. Can scrape a single page or recursively follow internal links.

    :param url: The URL to scrape.
    :param mode: "single" (only this page) or "recursive" (scrapes subpages).
    :return: A list of extracted text.
    """
    visited, resultados = set(), []
    queue = [url] if mode == "recursive" else [url]

    while queue:
        page_url = queue.pop(0)
        if page_url in visited:
            continue
        visited.add(page_url)

        try:
            response = requests.get(page_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10, verify=False)
            if response.status_code != 200:
                resultados.append(f"Error: {response.status_code}")
                continue

            soup = BeautifulSoup(response.text, "html.parser")
            text = " ".join(p.get_text(strip=True) for p in soup.find_all("p")) or "No se encontró contenido relevante."
            resultados.append(text.strip())
            
            print(resultados)

            if mode == "recursive":
                domain = urlparse(url).netloc
                links = {urljoin(page_url, a["href"]) for a in soup.find_all("a", href=True)}
                queue.extend(l for l in links if urlparse(l).netloc == domain and l not in visited)

        except requests.RequestException as e:
            resultados.append(f"Error al extraer el contenido: {e}")
            print(resultados[-1])
    print(resultados)
    return resultados

def chunk_text_by_tokens(
    texts: List[str],
    max_tokens: int = 2000,
    overlap_tokens: int = 200,
    model: str = "text-embedding-3-small"
) -> List[str]:
    """
    Takes a list of text segments and concatenates them into chunks
    where each chunk is <= max_tokens, measured by tiktoken for the given model.
    """
    
    
   # Use the local encoding—no network involved
    enc = tiktoken.get_encoding("cl100k_base")
    
    chunks: List[str] = []
    current_chunk: List[str] = []
    current_tokens = 0

    for segment in texts:
        seg_tokens = len(enc.encode(segment))
        if current_tokens + seg_tokens > max_tokens:
            chunks.append("\n".join(current_chunk))
            # carry overlap
            if overlap_tokens and current_chunk:
                seed_tokens = enc.encode("\n".join(current_chunk))[-overlap_tokens:]
                seed = enc.decode(seed_tokens)
                current_chunk = [seed]
                current_tokens = len(seed_tokens)
            else:
                current_chunk = []
                current_tokens = 0

        current_chunk.append(segment)
        current_tokens += seg_tokens

    if current_chunk:
        chunks.append("\n".join(current_chunk))

    return chunks

    index = faiss.read_index(f'{db_path}/vector_db.index')
    with open(f'{db_path}/metadata.pkl', "rb") as f:
        texts = pickle.load(f)

    query_embedding = np.array(model.encode([query])).astype(np.float32)
    distances, indices = index.search(query_embedding, top_k)
    results = [(texts[idx], distances[0][i]) for i, idx in enumerate(indices[0]) if idx != -1]
    # print(results)
    return results