import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import type { IEmailAdapter } from './interfaces/email-adapter.interface';
import { EMAIL_ADAPTER } from './interfaces/email-adapter.interface';
import { EmailTemplateService } from './email-template.service';

export interface OtpEmailContext {
  name: string;
  otp: string;
  amount: number;
  expirationMinutes: number;
}

export interface WelcomeEmailContext {
  name: string;
  document: string;
  email: string;
}

export interface PaymentConfirmedContext {
  name: string;
  amount: number;
  sessionId: string;
  date: string;
}

export interface LoginOtpEmailContext {
  name: string;
  otp: string;
  expirationMinutes: number;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @Inject(EMAIL_ADAPTER) private readonly adapter: IEmailAdapter,
    private readonly templateService: EmailTemplateService,
  ) {}

  async sendOtpEmail(to: string, context: OtpEmailContext): Promise<boolean> {
    const subject = 'Codigo de Confirmacion de Pago - Digital Wallet';
    const html = this.templateService.render('payment-otp', {
      ...context,
      amount: context.amount.toLocaleString('es-CO'),
      expirationMinutes: context.expirationMinutes,
    });
    return this.adapter.send(to, subject, html);
  }

  async sendWelcomeEmail(
    to: string,
    context: WelcomeEmailContext,
  ): Promise<boolean> {
    const subject = 'Bienvenido a Digital Wallet';
    const html = this.templateService.render('welcome', {
      ...context,
    } as Record<string, unknown>);
    return this.adapter.send(to, subject, html);
  }

  async sendPaymentConfirmedEmail(
    to: string,
    context: PaymentConfirmedContext,
  ): Promise<boolean> {
    const subject = 'Pago Confirmado - Digital Wallet';
    const html = this.templateService.render('payment-confirmed', {
      ...context,
      amount: context.amount.toLocaleString('es-CO'),
    });
    return this.adapter.send(to, subject, html);
  }

  async sendLoginOtpEmail(
    to: string,
    context: LoginOtpEmailContext,
  ): Promise<boolean> {
    const subject = 'Codigo para iniciar sesion - Digital Wallet';
    const html = this.templateService.render('login-otp', {
      ...context,
      expirationMinutes: context.expirationMinutes,
    } as Record<string, unknown>);
    return this.adapter.send(to, subject, html);
  }
}
