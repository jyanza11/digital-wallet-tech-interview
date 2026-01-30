import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateClientDto, RequestLoginOtpDto, ConfirmLoginOtpDto } from './dto';
import type { Client, Wallet } from '@repo/database';
import { maskEmail } from '../utils/mask-email';

const LOGIN_OTP_EXPIRATION_MINUTES = 5;

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async create(
    createClientDto: CreateClientDto,
  ): Promise<Client & { wallet: Wallet }> {
    // Check if client already exists by document or email
    const existingClient = await this.prisma.client.findFirst({
      where: {
        OR: [
          { document: createClientDto.document },
          { email: createClientDto.email },
        ],
      },
    });

    if (existingClient) {
      if (existingClient.document === createClientDto.document) {
        throw new ConflictException('Ya existe un cliente con este documento');
      }
      throw new ConflictException('Ya existe un cliente con este email');
    }

    // Create client with wallet
    const client = await this.prisma.client.create({
      data: {
        document: createClientDto.document,
        name: createClientDto.name,
        email: createClientDto.email,
        phone: createClientDto.phone,
        wallet: {
          create: {
            balance: 0,
          },
        },
      },
      include: {
        wallet: true,
      },
    });

    // Send welcome email (async, don't wait)
    void this.emailService.sendWelcomeEmail(client.email, {
      name: client.name,
      document: client.document,
      email: client.email,
    });

    return client as Client & { wallet: Wallet };
  }

  async findByDocumentAndPhone(
    document: string,
    phone: string,
  ): Promise<Client & { wallet: Wallet | null }> {
    const client = await this.prisma.client.findFirst({
      where: {
        document,
        phone,
      },
      include: {
        wallet: true,
      },
    });

    if (!client) {
      throw new NotFoundException(
        'Cliente no encontrado o los datos no coinciden',
      );
    }

    return client;
  }

  async findById(id: string): Promise<Client & { wallet: Wallet | null }> {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        wallet: true,
      },
    });

    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return client;
  }

  async findByDocument(document: string): Promise<Client | null> {
    return this.prisma.client.findUnique({
      where: { document },
    });
  }

  /**
   * Find client by email, document and phone (all must match)
   */
  async findByEmailDocumentAndPhone(
    email: string,
    document: string,
    phone: string,
  ): Promise<Client & { wallet: Wallet | null }> {
    const client = await this.prisma.client.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        document: document.trim(),
        phone: phone.trim(),
      },
      include: {
        wallet: true,
      },
    });

    if (!client) {
      throw new NotFoundException(
        'Cliente no encontrado. Verifica email, documento y celular.',
      );
    }

    return client;
  }

  /**
   * Request login OTP: validate email+document+phone, generate OTP, send to email
   */
  async requestLoginOtp(dto: RequestLoginOtpDto): Promise<{ message: string }> {
    const client = await this.findByEmailDocumentAndPhone(
      dto.email,
      dto.document,
      dto.phone,
    );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + LOGIN_OTP_EXPIRATION_MINUTES);

    // LoginOtp model exists after prisma generate (schema.prisma)
    const loginOtp = (
      this.prisma as unknown as {
        loginOtp: {
          create: (a: unknown) => Promise<unknown>;
          deleteMany: (a: unknown) => Promise<unknown>;
        };
      }
    ).loginOtp;
    await loginOtp.create({
      data: {
        email: client.email.toLowerCase(),
        otp,
        expiresAt,
      },
    });

    const sent = await this.emailService.sendLoginOtpEmail(client.email, {
      name: client.name,
      otp,
      expirationMinutes: LOGIN_OTP_EXPIRATION_MINUTES,
    });

    if (!sent) {
      await loginOtp.deleteMany({
        where: { email: client.email, otp },
      });
      throw new BadRequestException(
        'No se pudo enviar el codigo al correo. Intenta de nuevo.',
      );
    }

    return {
      message: `Codigo enviado a ${maskEmail(client.email)}. Revisa tu correo.`,
    };
  }

  /**
   * Confirm login OTP: validate OTP, return client + wallet for session
   */
  async confirmLoginOtp(
    dto: ConfirmLoginOtpDto,
  ): Promise<Client & { wallet: Wallet }> {
    const email = dto.email.trim().toLowerCase();
    const loginOtp = (
      this.prisma as unknown as {
        loginOtp: {
          findFirst: (a: unknown) => Promise<{
            id: string;
            expiresAt: Date;
          } | null>;
          delete: (a: unknown) => Promise<unknown>;
        };
      }
    ).loginOtp;

    const record = await loginOtp.findFirst({
      where: {
        email,
        otp: dto.otp.trim(),
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException('Codigo invalido o expirado');
    }

    if (new Date() > record.expiresAt) {
      await loginOtp.delete({ where: { id: record.id } });
      throw new BadRequestException(
        'El codigo ha expirado. Solicita uno nuevo.',
      );
    }

    const client = await this.prisma.client.findFirst({
      where: { email },
      include: { wallet: true },
    });

    if (!client || !client.wallet) {
      await loginOtp.delete({ where: { id: record.id } });
      throw new NotFoundException('Cliente no encontrado');
    }

    await loginOtp.delete({ where: { id: record.id } });

    return client as Client & { wallet: Wallet };
  }
}
