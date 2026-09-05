/*
 * File Path: ApiGateway_HCMS/server.js
 * Application Name: ApiGateway_HCMS
 * Description: Production-ready Node.js Express API Gateway for Health Club Management System (HCMS).
 */

const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8085;
const SPRING_BOOT_HOST = process.env.SPRING_BOOT_URL || 'http://127.0.0.1:8081';
const PYTHON_CHATBOT_HOST = process.env.PYTHON_CHATBOT_URL || 'http://127.0.0.1:8090';
const REACT_FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';

// -----------------------------------------------------------------------------------------
// 1. CROSS-ORIGIN RESOURCE SHARING (CORS) CONFIGURATION
// -----------------------------------------------------------------------------------------
app.use(cors({
  origin: [REACT_FRONTEND_ORIGIN, 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Request Ingestion Logger
app.use((req, res, next) => {
  console.log(`[GATEWAY LOG] ${new Date().toISOString()} | ${req.method} ${req.url} | Client: ${req.headers.origin || 'Browser'}`);
  next();
});

// -----------------------------------------------------------------------------------------
// 2. PYTHON RAG AI CHATBOT MICROSERVICE PROXY ROUTES (/api/chatbot/*, /api/assistant/*)
// Target: http://127.0.0.1:8090
// -----------------------------------------------------------------------------------------
app.use(['/api/chatbot', '/api/assistant'], createProxyMiddleware({
  target: PYTHON_CHATBOT_HOST,
  changeOrigin: true,
  pathRewrite: (path, req) => req.originalUrl
}));

// -----------------------------------------------------------------------------------------
// 3. SPRING BOOT CORE BACKEND SERVICE PROXY ROUTES (/api/*)
// Target: http://127.0.0.1:8081
// -----------------------------------------------------------------------------------------
app.use('/api', createProxyMiddleware({
  target: SPRING_BOOT_HOST,
  changeOrigin: true,
  pathRewrite: (path, req) => req.originalUrl
}));

// -----------------------------------------------------------------------------------------
// 4. GATEWAY HEALTH MONITOR ENDPOINT
// -----------------------------------------------------------------------------------------
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    gateway: 'ApiGateway_HCMS',
    port: PORT,
    springBootBackend: SPRING_BOOT_HOST,
    pythonChatbotService: PYTHON_CHATBOT_HOST,
    clientOrigin: REACT_FRONTEND_ORIGIN,
    timestamp: new Date().toISOString()
  });
});

// Start ApiGateway_HCMS Server
app.listen(PORT, () => {
  console.log(`
=================================================================================
🚀 APIGATEWAY_HCMS SERVER RUNNING SUCCESSFULLY ON PORT ${PORT}!
=================================================================================
🌐 Gateway URL:            http://localhost:${PORT}
📱 React Client Origin:    ${REACT_FRONTEND_ORIGIN}
⚙️ Spring Boot Target:     ${SPRING_BOOT_HOST}
🤖 Python RAG AI Target:   ${PYTHON_CHATBOT_HOST}
=================================================================================
`);
});
