import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientsService } from '../clients/clients.service';
import { RechargeWalletDto, CheckBalanceDto } from './dto';
import { TransactionType } from '@repo/database';

@Injectable()
export class WalletService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clientsService: ClientsService,
  ) {}

  async recharge(rechargeDto: RechargeWalletDto) {
    // Verify client exists and data matches
    const client = await this.clientsService.findByDocumentAndPhone(
      rechargeDto.document,
      rechargeDto.phone,
    );

    if (!client.wallet) {
      throw new NotFoundException('El cliente no tiene una billetera asociada');
    }

    // Use transaction to ensure atomicity
    const result = await this.prisma.$transaction(async (tx) => {
      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { id: client.wallet!.id },
        data: {
          balance: {
            increment: rechargeDto.amount,
          },
        },
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          type: TransactionType.RECHARGE,
          amount: rechargeDto.amount,
          clientId: client.id,
        },
      });

      return updatedWallet;
    });

    return {
      clientId: client.id,
      name: client.name,
      newBalance: Number(result.balance),
      rechargedAmount: rechargeDto.amount,
    };
  }

  async getBalance(checkBalanceDto: CheckBalanceDto) {
    // Verify client exists and data matches
    const client = await this.clientsService.findByDocumentAndPhone(
      checkBalanceDto.document,
      checkBalanceDto.phone,
    );

    if (!client.wallet) {
      throw new NotFoundException('El cliente no tiene una billetera asociada');
    }

    return {
      clientId: client.id,
      name: client.name,
      document: client.document,
      balance: Number(client.wallet.balance),
    };
  }

  async deductBalance(clientId: string, amount: number): Promise<void> {
    const client = await this.clientsService.findById(clientId);

    if (!client.wallet) {
      throw new NotFoundException('El cliente no tiene una billetera asociada');
    }

    const currentBalance = Number(client.wallet.balance);

    if (currentBalance < amount) {
      throw new BadRequestException(
        `Saldo insuficiente. Saldo actual: $${currentBalance.toLocaleString()}`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: client.wallet!.id },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      await tx.transaction.create({
        data: {
          type: TransactionType.PAYMENT,
          amount: amount,
          clientId: clientId,
        },
      });
    });
  }

  async hasEnoughBalance(clientId: string, amount: number): Promise<boolean> {
    const client = await this.clientsService.findById(clientId);

    if (!client.wallet) {
      return false;
    }

    return Number(client.wallet.balance) >= amount;
  }
}
