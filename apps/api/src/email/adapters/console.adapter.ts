import { Injectable, Logger } from '@nestjs/common';
import type { IEmailAdapter } from '../interfaces/email-adapter.interface';

@Injectable()
export class ConsoleEmailAdapter implements IEmailAdapter {
  private readonly logger = new Logger(ConsoleEmailAdapter.name);

  async send(to: string, subject: string, html: string): Promise<boolean> {
    this.logger.log('='.repeat(60));
    this.logger.log('[EMAIL CONSOLE - no enviado]');
    this.logger.log(`To: ${to}`);
    this.logger.log(`Subject: ${subject}`);
    this.logger.log(`HTML length: ${html.length} chars`);
    this.logger.log('='.repeat(60));
    return true;
  }
}
