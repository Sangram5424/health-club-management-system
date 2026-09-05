# Python Health Club Chatbot Service (`python-chatbot-service`)

A high-performance Python **FastAPI** microservice converted from the Java Spring Boot [`chatbot-service`](file:///Users/sangram/Desktop/temp/Backend_HCMS/chatbot-service).

---

## 📌 Architecture & Spring Boot Mapping

| Feature / Component | Java Spring Boot (`chatbot-service`) | Python FastAPI (`python-chatbot-service`) |
| :--- | :--- | :--- |
| **Framework** | Spring Boot 3 + Embedded Tomcat | FastAPI + Uvicorn |
| **Port** | `8090` | `8090` |
| **Database ORM** | Spring Data JPA / Hibernate | SQLAlchemy |
| **Database** | MySQL / H2 | SQLite (`health_club_chatbot.db`) / MySQL |
| **Validation / DTOs** | Java Records (`ChatDtos`) | Pydantic Schemas (`ChatRequest`, `ChatResponse`) |
| **HTTP Client** | Spring WebClient | `httpx` Async Client |
| **GenAI Provider** | Google Gemini REST API | Google Gemini REST API + Rule Fallback |

---

## 📁 Project Structure

```
python-chatbot-service/
├── main.py                    # FastAPI App Entrypoint & REST Routes
├── database.py                # SQLAlchemy DB Engine & Session Config
├── models.py                  # Database Entities (ChatConversation, ChatMessage)
├── schemas.py                 # Pydantic Request/Response Models
├── services/
│   ├── __init__.py
│   ├── chatbot_service.py     # Conversation Management & Chat Workflow
│   └── genai_client.py        # Gemini REST API & Fallback Engine
├── .env                       # Environment Variables
├── .env.example               # Environment Template
├── requirements.txt           # Python Package Dependencies
└── README.md                  # System Documentation
```

---

## ⚙️ Environment Configuration (`.env`)

```env
PORT=8090
GENAI_API_KEY=your_gemini_api_key_here
GENAI_MODEL=gemini-1.5-flash
GENAI_ENDPOINT=https://generativelanguage.googleapis.com/v1beta/models
DATABASE_URL=sqlite:///./health_club_chatbot.db
```

> **Note**: If `GENAI_API_KEY` is left blank, the microservice automatically uses an intelligent rule-based fallback engine tailored for health club membership plans, trainers, attendance, classes, and payments.

---

## 🚀 How to Run the Service

### Step 1: Create a Virtual Environment & Install Dependencies

```bash
cd /Users/sangram/Desktop/temp/python-chatbot-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 2: Start the FastAPI Server

```bash
python main.py
```
*Or using Uvicorn directly:*
```bash
uvicorn main:app --host 0.0.0.0 --port 8090 --reload
```

---

## 📡 REST API Endpoints

### 1. Root Status Endpoint
- **URL**: `GET http://localhost:8090/`
- **Response**:
```json
{
  "application": "HCMS Python Chatbot Service",
  "status": "RUNNING",
  "port": 8090,
  "chatApi": "/api/chatbot/chat",
  "framework": "FastAPI (Python 3)"
}
```

### 2. Chat Endpoint (POST)
- **URL**: `POST http://localhost:8090/api/chatbot/chat`
- **Headers**: `Content-Type: application/json`
- **Payload**:
```json
{
  "conversationId": null,
  "userId": 101,
  "roleName": "member",
  "message": "How do I upgrade my plan?"
}
```
- **Response**:
```json
{
  "conversationId": 1,
  "reply": "You can view plans from the Plans section. Admin can add or update plans, and members can choose or upgrade a plan."
}
```

---

## 🔗 Integration with React Frontend (`Frontend_HCMS`)

The React frontend sends requests to `http://localhost:8090/api/chatbot/chat`.
Since this Python service runs on port `8090` and matches the exact API contract of `ChatbotController.java`, no changes are required in the React frontend!
