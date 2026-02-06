import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * OpenClaw Gateway Integration
 * Connects to the local OpenClaw Gateway to send messages to MoltBot
 */
class OpenClawIntegration {
  private gatewayUrl: string;
  private sessionKey: string;

  constructor() {
    this.gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3380';
    this.sessionKey = 'agent:main:main';
  }

  /**
   * Send a message to MoltBot via OpenClaw Gateway
   */
  async sendMessage(text: string): Promise<string> {
    try {
      // Using openclaw CLI to send message
      // This will interact with the main agent session
      const command = `openclaw sessions send --session="${this.sessionKey}" --message="${text.replace(/"/g, '\\"')}"`;
      
      console.log('Executing:', command);
      const { stdout, stderr } = await execAsync(command, {
        timeout: 30000, // 30s timeout
        env: { ...process.env }
      });

      if (stderr) {
        console.error('OpenClaw stderr:', stderr);
      }

      return stdout.trim() || 'Message sent to MoltBot';
    } catch (error) {
      console.error('Error sending to OpenClaw:', error);
      throw new Error('Failed to communicate with MoltBot');
    }
  }

  /**
   * List active sessions
   */
  async listSessions(): Promise<any[]> {
    try {
      const { stdout } = await execAsync('openclaw sessions list --json');
      return JSON.parse(stdout);
    } catch (error) {
      console.error('Error listing sessions:', error);
      return [];
    }
  }

  /**
   * Get session status
   */
  async getSessionStatus(sessionKey: string): Promise<any> {
    try {
      const { stdout } = await execAsync(`openclaw sessions status --session="${sessionKey}" --json`);
      return JSON.parse(stdout);
    } catch (error) {
      console.error('Error getting session status:', error);
      return null;
    }
  }
}

export const openclawIntegration = new OpenClawIntegration();
