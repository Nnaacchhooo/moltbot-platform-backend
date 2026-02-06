import fetch from 'node-fetch';

/**
 * OpenClaw Integration via Proxy
 * Connects to MoltBot through a proxy server
 */
class OpenClawIntegration {
  private proxyUrl: string;

  constructor() {
    // Use proxy server that has access to openclaw CLI
    this.proxyUrl = process.env.OPENCLAW_PROXY_URL || 'http://localhost:3002';
  }

  /**
   * Send a message to MoltBot via proxy
   */
  async sendMessage(text: string): Promise<string> {
    try {
      const response = await fetch(`${this.proxyUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: text }),
        signal: AbortSignal.timeout(30000) // 30s timeout
      });

      if (!response.ok) {
        throw new Error(`Proxy responded with ${response.status}`);
      }

      const data = await response.json() as any;
      return data.response || 'Message sent to MoltBot';
    } catch (error) {
      console.error('Error sending to MoltBot:', error);
      throw new Error('Failed to communicate with MoltBot');
    }
  }

  /**
   * List active sessions (not implemented yet)
   */
  async listSessions(): Promise<any[]> {
    return [];
  }

  /**
   * Get session status (not implemented yet)
   */
  async getSessionStatus(sessionKey: string): Promise<any> {
    return null;
  }
}

export const openclawIntegration = new OpenClawIntegration();
