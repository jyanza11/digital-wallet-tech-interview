import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { IEmailAdapter } from '../interfaces/email-adapter.interface';
import { maskEmail } from '../../utils';

@Injectable()
export class GmailEmailAdapter implements IEmailAdapter {
  private readonly logger = new Logger(GmailEmailAdapter.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    const user = this.configService.get<string>('GMAIL_USER');
    const pass =
      this.configService.get<string>('GMAIL_APP_PASSWORD') ||
      this.configService.get<string>('GMAIL_SECRET');
    if (!user || !pass) {
      throw new Error(
        'GMAIL_USER y GMAIL_APP_PASSWORD (o GMAIL_SECRET) son requeridos cuando EMAIL_PROVIDER=gmail',
      );
    }
    this.from =
      this.configService.get<string>('MAIL_FROM') ||
      `"Digital Wallet" <${user}>`;
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user,
        pass,
      },
    });
  }

  async send(to: string, subject: string, html: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html,
      });
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
