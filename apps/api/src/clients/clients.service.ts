import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto';
import type { Client, Wallet } from '@repo/database';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

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
        throw new ConflictException(
          'Ya existe un cliente con este documento',
        );
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
}
