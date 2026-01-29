import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientsService } from '../clients/clients.service';
import { WalletService } from '../wallet/wallet.service';
import { EmailService } from '../email/email.service';
import { RequestPaymentDto, ConfirmPaymentDto } from './dto';
import { SessionStatus } from '@repo/database';

const OTP_EXPIRATION_MINUTES = 5;

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clientsService: ClientsService,
    private readonly walletService: WalletService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Generate a 6-digit OTP token
   */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Request a new payment session
   * - Validates client exists
   * - Checks sufficient balance
   * - Generates OTP
   * - Sends email with OTP
   * - Returns session ID
   */
  async requestPayment(requestDto: RequestPaymentDto) {
    // Find client by document and phone
    const client = await this.clientsService.findByDocumentAndPhone(
      requestDto.document,
      requestDto.phone,
    );

    // Check if client has enough balance
    const hasBalance = await this.walletService.hasEnoughBalance(
      client.id,
      requestDto.amount,
    );

    if (!hasBalance) {
      throw new BadRequestException('Saldo insuficiente para realizar el pago');
    }

    // Generate OTP token
    const otp = this.generateOtp();

    // Create payment session
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRATION_MINUTES);

    const session = await this.prisma.paymentSession.create({
      data: {
        token: otp,
        amount: requestDto.amount,
        status: SessionStatus.PENDING,
        expiresAt,
        clientId: client.id,
      },
    });

    // Send OTP via email
    const emailSent = await this.emailService.sendOtpEmail(client.email, {
      name: client.name,
      otp,
      amount: requestDto.amount,
      expirationMinutes: OTP_EXPIRATION_MINUTES,
    });

    if (!emailSent) {
      // Cancel the session if email fails
      await this.prisma.paymentSession.update({
        where: { id: session.id },
        data: { status: SessionStatus.CANCELLED },
      });

      throw new BadRequestException(
        'No se pudo enviar el codigo de confirmacion. Intente nuevamente.',
      );
    }

    return {
      sessionId: session.id,
      message: `Se ha enviado un codigo de confirmacion a ${this.maskEmail(client.email)}`,
      expiresAt: session.expiresAt,
    };
  }

  /**
   * Confirm a payment with OTP token
   * - Validates session exists and is pending
   * - Validates OTP matches
   * - Validates session not expired
   * - Deducts balance from wallet
   * - Marks session as confirmed
   */
  async confirmPayment(confirmDto: ConfirmPaymentDto) {
    // Find session
    const session = await this.prisma.paymentSession.findUnique({
      where: { id: confirmDto.sessionId },
      include: { client: true },
    });

    if (!session) {
      throw new NotFoundException('Sesion de pago no encontrada');
    }

    // Check session status
    if (session.status !== SessionStatus.PENDING) {
      throw new BadRequestException(
        `Esta sesion de pago ya fue ${session.status === SessionStatus.CONFIRMED ? 'confirmada' : session.status === SessionStatus.EXPIRED ? 'expirada' : 'cancelada'}`,
      );
    }

    // Check if session expired
    if (new Date() > session.expiresAt) {
      // Mark as expired
      await this.prisma.paymentSession.update({
        where: { id: session.id },
        data: { status: SessionStatus.EXPIRED },
      });

      throw new BadRequestException(
        'El codigo de confirmacion ha expirado. Solicite un nuevo pago.',
      );
    }

    // Validate OTP
    if (session.token !== confirmDto.token) {
      throw new UnauthorizedException('Codigo de confirmacion invalido');
    }

    // Verify balance again (in case it changed)
    const hasBalance = await this.walletService.hasEnoughBalance(
      session.clientId,
      Number(session.amount),
    );

    if (!hasBalance) {
      await this.prisma.paymentSession.update({
        where: { id: session.id },
        data: { status: SessionStatus.CANCELLED },
      });

      throw new BadRequestException('Saldo insuficiente para realizar el pago');
    }

    // Process payment within a transaction
    await this.prisma.$transaction(async (tx) => {
      // Deduct balance (this also creates the transaction record)
      await this.walletService.deductBalance(
        session.clientId,
        Number(session.amount),
      );

      // Mark session as confirmed
      await tx.paymentSession.update({
        where: { id: session.id },
        data: { status: SessionStatus.CONFIRMED },
      });
    });

    // Send payment confirmation email (async, don't wait)
    this.emailService.sendPaymentConfirmedEmail(session.client.email, {
      name: session.client.name,
      amount: Number(session.amount),
      sessionId: session.id,
      date: new Date().toLocaleString('es-CO', {
        dateStyle: 'long',
        timeStyle: 'short',
      }),
    });

    return {
      sessionId: session.id,
      amount: Number(session.amount),
      clientName: session.client.name,
      message: 'Pago realizado exitosamente',
    };
  }

  /**
   * Get payment session status
   */
  async getSessionStatus(sessionId: string) {
    const session = await this.prisma.paymentSession.findUnique({
      where: { id: sessionId },
      include: { client: { select: { name: true } } },
    });

    if (!session) {
      throw new NotFoundException('Sesion de pago no encontrada');
    }

    // Check and update if expired
    if (
      session.status === SessionStatus.PENDING &&
      new Date() > session.expiresAt
    ) {
      await this.prisma.paymentSession.update({
        where: { id: session.id },
        data: { status: SessionStatus.EXPIRED },
      });
      session.status = SessionStatus.EXPIRED;
    }

    return {
      sessionId: session.id,
      status: session.status,
      amount: Number(session.amount),
      clientName: session.client.name,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
    };
  }

  /**
   * Mask email for privacy (e.g., j***@example.com)
   */
  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart[0]}***${localPart[localPart.length - 1]}@${domain}`;
  }
}
