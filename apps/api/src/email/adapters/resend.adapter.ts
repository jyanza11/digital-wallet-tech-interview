import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import type { IEmailAdapter } from '../interfaces/email-adapter.interface';
import { maskEmail } from '../../utils';

@Injectable()
export class ResendEmailAdapter implements IEmailAdapter {
  private readonly logger = new Logger(ResendEmailAdapter.name);
  private readonly resend: Resend;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error(
        'RESEND_API_KEY es requerido cuando EMAIL_PROVIDER=resend',
      );
    }
    this.resend = new Resend(apiKey);
    this.from =
      this.configService.get<string>('MAIL_FROM') ||
      'Digital Wallet <onboarding@resend.dev>';
  }

  async send(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const { error } = await this.resend.emails.send({
        from: this.from,
        to: [to],
        subject,
        html,
      });
      if (error) {
        this.logger.error(`Error enviando email: ${error.message}`);
        return false;
      }
      this.logger.log(`Email enviado exitosamente a ${maskEmail(to)}`);
      return true;
    } catch (err) {
      this.logger.error(
        `Error enviando email: ${err instanceof Error ? err.message : err}`,
      );
      return false;
    }
  }
}
