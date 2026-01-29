import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { RechargeWalletDto, CheckBalanceDto } from './dto';
import { ApiResponse } from '../common';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  /**
   * POST /api/wallet/recharge
   * Recharge the wallet
   */
  @ApiOperation({ summary: 'Recargar billetera' })
  @Post('recharge')
  async recharge(@Body() rechargeDto: RechargeWalletDto) {
    const result = await this.walletService.recharge(rechargeDto);

    return ApiResponse.success(
      result,
      `Recarga exitosa de $${rechargeDto.amount.toLocaleString()}`,
    );
  }

  /**
   * POST /api/wallet/balance
   * Get the balance of the wallet
   */
  @ApiOperation({ summary: 'Consultar saldo' })
  @Post('balance')
  async getBalance(@Body() checkBalanceDto: CheckBalanceDto) {
    const result = await this.walletService.getBalance(checkBalanceDto);

    return ApiResponse.success(result, 'Consulta de saldo exitosa');
  }
}
