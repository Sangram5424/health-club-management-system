"""
File Path: python-chatbot-service/services/genai_client.py

Description:
Asynchronous GenAI Client for the Health Club Management System (HCMS).

Features:
- Retrieves relevant context from the RAG Knowledge Base.
- Sends the retrieved context and user query to the Gemini API.
- Returns a fallback response when the API is unavailable.
"""

import os

import httpx
from dotenv import load_dotenv

from services.rag_knowledge_base import rag_knowledge_base

load_dotenv()


class GenAiClient:
    """
    AI client that combines retrieved knowledge with
    the user's query before sending it to Gemini.
    """

    def __init__(self):
        self.api_key = os.getenv("GENAI_API_KEY", "").strip()
        self.endpoint = os.getenv(
            "GENAI_ENDPOINT",
            "https://generativelanguage.googleapis.com/v1beta/models"
        ).rstrip("/")
        self.model = os.getenv(
            "GENAI_MODEL",
            "gemini-1.5-flash"
        )

    async def reply(self, role_name: str, message: str) -> str:
        """
        RAG Flow

        1. Retrieve relevant context.
        2. Build an augmented prompt.
        3. Send the prompt to Gemini.
        4. Return a fallback response if the API is unavailable.
        """

        # Retrieve relevant context
        retrieved_context = rag_knowledge_base.retrieve_context(message)

        if not self.api_key:
            return self._fallback_response(retrieved_context)

        prompt = f"""
You are an AI assistant for the Health Club Management System.

Answer the user's question using ONLY the retrieved context below.

Retrieved Context:
{retrieved_context}

User Role:
{role_name}

User Question:
{message}

Instructions:
- Answer only using the retrieved information.
- Keep the response clear and concise.
- If the retrieved context does not contain the answer,
  politely state that the information is unavailable.
"""

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        }

        url = (
            f"{self.endpoint}/"
            f"{self.model}:generateContent?key={self.api_key}"
        )

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    url,
                    json=payload
                )

                response.raise_for_status()

                data = response.json()

                candidates = data.get("candidates", [])

                if candidates:
                    parts = candidates[0].get(
                        "content",
                        {}
                    ).get(
                        "parts",
                        []
                    )

                    if parts and "text" in parts[0]:
                        return parts[0]["text"].strip()

        except Exception as ex:
            print(f"Gemini API Error: {ex}")

        return self._fallback_response(retrieved_context)

    def _fallback_response(self, context: str) -> str:
        """
        Returns the retrieved knowledge when the
        AI service is unavailable.
        """

        if context:
            return (
                "The AI service is currently unavailable.\n\n"
                "Relevant information:\n"
                f"{context}"
            )

        return (
            "The requested information is not available in the "
            "knowledge base."
        )


# Singleton instance
genai_client = GenAiClient()