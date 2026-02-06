import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Server } from 'socket.io';
import { openclawIntegration } from './openclaw.js';
import { authRoutes } from './routes/auth.js';
import { chatRoutes } from './routes/chat.js';

const app = Fastify({
  logger: true
});

// CORS - allow all for MVP (cloudflare tunnels)
await app.register(cors, {
  origin: true,
  credentials: true
});

// Routes
await app.register(authRoutes, { prefix: '/api/auth' });
await app.register(chatRoutes, { prefix: '/api/chat' });

// Health check
app.get('/health', async () => {
  return { status: 'ok', timestamp: Date.now() };
});

// Socket.io setup
const io = new Server(app.server, {
  cors: {
    origin: true,
    credentials: true
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('chat:message', async (msg) => {
    try {
      console.log('Received message:', msg);
      
      // Send to OpenClaw main session
      const response = await openclawIntegration.sendMessage(msg.text);
      
      // Stream back to user
      socket.emit('chat:response', {
        text: response,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('chat:error', {
        error: 'Failed to process message',
        timestamp: Date.now()
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Backend running on http://localhost:${port}`);
    console.log(`🔌 WebSocket ready on ws://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
