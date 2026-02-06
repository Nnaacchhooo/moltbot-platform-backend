import { FastifyPluginAsync } from 'fastify';

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Login endpoint
  fastify.post<{ Body: LoginBody }>('/login', async (request, reply) => {
    const { email, password } = request.body;

    // TODO: Implement real auth with PostgreSQL
    // For MVP, simple mock
    if (email && password) {
      const token = 'mock-jwt-token-' + Date.now();
      return {
        success: true,
        token,
        user: {
          id: '1',
          email,
          name: email.split('@')[0]
        }
      };
    }

    reply.code(401);
    return { success: false, error: 'Invalid credentials' };
  });

  // Register endpoint
  fastify.post<{ Body: RegisterBody }>('/register', async (request, reply) => {
    const { email, password, name } = request.body;

    // TODO: Implement real registration
    if (email && password && name) {
      const token = 'mock-jwt-token-' + Date.now();
      return {
        success: true,
        token,
        user: {
          id: Date.now().toString(),
          email,
          name
        }
      };
    }

    reply.code(400);
    return { success: false, error: 'Invalid registration data' };
  });

  // Verify token endpoint
  fastify.get('/verify', async (request, reply) => {
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (token && token.startsWith('mock-jwt-token-')) {
      return {
        success: true,
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'Test User'
        }
      };
    }

    reply.code(401);
    return { success: false, error: 'Invalid token' };
  });
};
