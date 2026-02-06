# MoltBot Platform Backend

Backend server for MoltBot Platform MVP.

## Features

- ✅ Fastify REST API
- ✅ WebSocket support (Socket.io)
- ✅ OpenClaw Gateway integration
- ✅ JWT Authentication (mock for MVP)
- ✅ TypeScript

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Run development server
npm run dev
```

Server will start on http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (mock)
- `POST /api/auth/register` - Register (mock)
- `GET /api/auth/verify` - Verify token

### Chat
- `POST /api/chat/message` - Send message to MoltBot
- `GET /api/chat/sessions` - List active sessions

### WebSocket Events
- `chat:message` - Send message to MoltBot
- `chat:response` - Receive response from MoltBot
- `chat:error` - Error notification

## OpenClaw Integration

The backend communicates with OpenClaw Gateway using the `openclaw` CLI:

```typescript
// Send message to main agent session
await sessionsSend({
  sessionKey: 'agent:main:main',
  message: 'Hello MoltBot'
});
```

## Environment Variables

```
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/moltbot
JWT_SECRET=your-secret-key
OPENCLAW_GATEWAY_URL=http://localhost:3380
NODE_ENV=development
```

## TODO (Post-MVP)

- [ ] Real PostgreSQL database integration
- [ ] Real JWT authentication
- [ ] Session management
- [ ] File system monitoring
- [ ] Agent spawn/kill functionality
- [ ] Logs streaming
