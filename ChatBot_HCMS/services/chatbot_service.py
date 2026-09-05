"""
File Path: python-chatbot-service/services/chatbot_service.py

Description:
Service layer responsible for managing chatbot conversations,
storing chat history, and generating AI responses.
"""

from sqlalchemy.orm import Session

from models import ChatConversation, ChatMessage
from schemas import ChatRequest, ChatResponse
from services.rag_agent_service import agentic_rag_service


class ChatbotService:
    """
    Coordinates chatbot conversations.

    Responsibilities:
    - Create or retrieve conversations.
    - Store user and assistant messages.
    - Generate AI responses.
    """

    async def chat(self, request: ChatRequest, db: Session) -> ChatResponse:
        """
        Process a chat request.

        Steps:
        1. Retrieve or create a conversation.
        2. Store the user's message.
        3. Generate an AI response.
        4. Store the assistant's response.
        5. Return the response.
        """

        # Retrieve existing conversation or create a new one
        if request.conversationId:
            conversation = (
                db.query(ChatConversation)
                .filter(ChatConversation.id == request.conversationId)
                .first()
            )

            if conversation is None:
                conversation = self._create_conversation(request, db)
        else:
            conversation = self._create_conversation(request, db)

        # Save user message
        self._save_message(
            db,
            conversation.id,
            "USER",
            request.message
        )

        # Generate AI response
        reply = agentic_rag_service.process_query(
            request.roleName or "member",
            request.message
        )

        # Save assistant message
        self._save_message(
            db,
            conversation.id,
            "ASSISTANT",
            reply
        )

        db.commit()
        db.refresh(conversation)

        return ChatResponse(
            conversationId=conversation.id,
            reply=reply
        )

    def _create_conversation(
        self,
        request: ChatRequest,
        db: Session
    ) -> ChatConversation:
        """
        Create a new conversation.
        """

        conversation = ChatConversation(
            user_id=request.userId,
            role_name=request.roleName or "member",
            title="Health Club Chat"
        )

        db.add(conversation)
        db.flush()

        return conversation

    def _save_message(
        self,
        db: Session,
        conversation_id: int,
        sender: str,
        message: str
    ) -> ChatMessage:
        """
        Save a chat message.
        """

        chat_message = ChatMessage(
            conversation_id=conversation_id,
            sender=sender,
            message=message
        )

        db.add(chat_message)

        return chat_message


# Singleton instance
chatbot_service = ChatbotService()