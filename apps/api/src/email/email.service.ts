import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

interface OtpEmailContext {
  name: string;
  otp: string;
  amount: number;
  expirationMinutes: number;
}

interface WelcomeEmailContext {
  name: string;
  document: string;
  email: string;
}

interface PaymentConfirmedContext {
  name: string;
  amount: number;
  sessionId: string;
  date: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly isConfigured: boolean;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.isConfigured = !!this.configService.get<string>('MAIL_PASSWORD');

    if (!this.isConfigured) {
      this.logger.warn(
        'MAIL_PASSWORD no configurada. Los emails seran simulados en consola.',
      );
    }
  }

  /**
   * Send OTP code for payment confirmation
   */
  async sendOtpEmail(to: string, context: OtpEmailContext): Promise<boolean> {
    const subject = 'Codigo de Confirmacion de Pago - Digital Wallet';

    if (!this.isConfigured) {
      this.logSimulatedEmail(to, subject, 'payment-otp', context);
      return true;
    }

    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: 'payment-otp',
        context: {
          ...context,
          amount: context.amount.toLocaleString('es-CO'),
          year: new Date().getFullYear(),
        },
      });

      this.logger.log(`Email OTP enviado exitosamente a ${this.maskEmail(to)}`);
      return true;
    } catch (error) {
      this.logger.error(`Error enviando email OTP: ${error}`);
      return false;
    }
  }

  /**
   * Send welcome email after registration
   */
  async sendWelcomeEmail(
    to: string,
    context: WelcomeEmailContext,
  ): Promise<boolean> {
    const subject = 'Bienvenido a Digital Wallet';

    if (!this.isConfigured) {
      this.logSimulatedEmail(to, subject, 'welcome', context);
      return true;
    }

    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: 'welcome',
        context: {
          ...context,
          year: new Date().getFullYear(),
        },
      });

      this.logger.log(`Email de bienvenida enviado a ${this.maskEmail(to)}`);
      return true;
    } catch (error) {
      this.logger.error(`Error enviando email de bienvenida: ${error}`);
      return false;
    }
  }

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmedEmail(
    to: string,
    context: PaymentConfirmedContext,
  ): Promise<boolean> {
    const subject = 'Pago Confirmado - Digital Wallet';

    if (!this.isConfigured) {
      this.logSimulatedEmail(to, subject, 'payment-confirmed', context);
      return true;
    }

    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: 'payment-confirmed',
        context: {
          ...context,
          amount: context.amount.toLocaleString('es-CO'),
          year: new Date().getFullYear(),
        },
      });

      this.logger.log(`Email de confirmacion enviado a ${this.maskEmail(to)}`);
      return true;
    } catch (error) {
      this.logger.error(`Error enviando email de confirmacion: ${error}`);
      return false;
    }
  }

  /**
   * Log simulated email for development
   */
  private logSimulatedEmail<T extends object>(
    to: string,
    subject: string,
    template: string,
    context: T,
  ): void {
    this.logger.log('='.repeat(60));
    this.logger.log('[SIMULATED EMAIL]');
    this.logger.log(`To: ${to}`);
    this.logger.log(`Subject: ${subject}`);
    this.logger.log(`Template: ${template}`);
    this.logger.log(`Context: ${JSON.stringify(context, null, 2)}`);
    this.logger.log('='.repeat(60));
  }

  /**
   * Mask email for privacy in logs
   */
  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart[0]}***${localPart[localPart.length - 1]}@${domain}`;
  }
}
