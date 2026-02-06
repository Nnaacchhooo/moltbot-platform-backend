import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Server } from 'socket.io';
import fetch from 'node-fetch';

const app = Fastify({ logger: true });

const BRIDGE_URL = process.env.OPENCLAW_BRIDGE_URL || 'http://localhost:3003';

// Store active socket connections per user
const userSockets = new Map<string, any>();

// CORS
await app.register(cors, {
  origin: true,
  credentials: true
});

// Auth routes
app.post('/api/auth/login', async (req, reply) => {
  const { email, password } = req.body as any;
  return {
    success: true,
    token: 'mock-jwt-token',
    user: {
      id: email,
      email,
      name: email.split('@')[0]
    }
  };
});

app.post('/api/auth/register', async (req, reply) => {
  const { email, password, name } = req.body as any;
  return {
    success: true,
    token: 'mock-jwt-token',
    user: {
      id: email,
      email,
      name: name || email.split('@')[0]
    }
  };
});

// Webhook endpoint to receive responses from OpenClaw bridge
app.post('/webhook/openclaw', async (req, reply) => {
  const { userId, message, timestamp } = req.body as any;
  
  console.log(`Received webhook for user ${userId}:`, message?.substring(0, 50));
  
  // Find user's socket and send response
  const socket = userSockets.get(userId);
  if (socket) {
    socket.emit('chat:response', {
      text: message,
      timestamp: timestamp || Date.now()
    });
    console.log(`Sent response to user ${userId}`);
  } else {
    console.log(`No active socket for user ${userId}`);
  }
  
  return { success: true };
});

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
  
  let userId: string | null = null;

  socket.on('chat:register', (data) => {
    userId = data.userId || socket.id;
    userSockets.set(userId, socket);
    console.log(`Registered user: ${userId}`);
  });

  socket.on('chat:message', async (msg) => {
    try {
      if (!userId) {
        userId = socket.id;
        userSockets.set(userId, socket);
      }
      
      console.log(`Message from ${userId}:`, msg.text);
      
      // Send to OpenClaw bridge
      const response = await fetch(`${BRIDGE_URL}/api/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg.text,
          userId
        }),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`Bridge error: ${response.status}`);
      }
      
      console.log(`Sent to bridge for user ${userId}`);
      
      // Response will come via webhook
      
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('chat:error', {
        error: 'Failed to process message',
        timestamp: Date.now()
      });
    }
  });

  socket.on('disconnect', () => {
    if (userId) {
      userSockets.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
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
    console.log(`🌉 Bridge URL: ${BRIDGE_URL}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
