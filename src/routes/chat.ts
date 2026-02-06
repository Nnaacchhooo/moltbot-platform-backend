import { FastifyPluginAsync } from 'fastify';
import { openclawIntegration } from '../openclaw.js';

export const chatRoutes: FastifyPluginAsync = async (fastify) => {
  // Send message to MoltBot
  fastify.post('/message', async (request, reply) => {
    const { text } = request.body as { text: string };

    if (!text) {
      reply.code(400);
      return { success: false, error: 'Message text is required' };
    }

    try {
      const response = await openclawIntegration.sendMessage(text);
      return {
        success: true,
        response,
        timestamp: Date.now()
      };
    } catch (error) {
      reply.code(500);
      return {
        success: false,
        error: 'Failed to send message to MoltBot'
      };
    }
  });

  // Get active sessions
  fastify.get('/sessions', async (request, reply) => {
    try {
      const sessions = await openclawIntegration.listSessions();
      return {
        success: true,
        sessions
      };
    } catch (error) {
      reply.code(500);
      return {
        success: false,
        error: 'Failed to fetch sessions'
      };
    }
  });
};
