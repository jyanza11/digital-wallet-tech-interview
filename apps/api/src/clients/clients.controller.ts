import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto, RequestLoginOtpDto, ConfirmLoginOtpDto } from './dto';
import { ApiResponse } from '../common';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  /**
   * POST /api/clients/register
   * Register a new client with a wallet
   */
  @ApiOperation({ summary: 'Registro de cliente' })
  @Post('register')
  async register(@Body() createClientDto: CreateClientDto) {
    const client = await this.clientsService.create(createClientDto);

    return ApiResponse.success(
      {
        id: client.id,
        document: client.document,
        name: client.name,
        email: client.email,
        phone: client.phone,
        wallet: {
          id: client.wallet.id,
          balance: Number(client.wallet.balance),
        },
      },
      'Cliente registrado exitosamente',
    );
  }

  /**
   * POST /api/clients/login/request
   * Request login OTP: validate email + document + phone, send OTP to email
   */
  @ApiOperation({ summary: 'Solicitar código de inicio de sesión' })
  @Post('login/request')
  async requestLoginOtp(@Body() dto: RequestLoginOtpDto) {
    const result = await this.clientsService.requestLoginOtp(dto);
    return ApiResponse.success(result, result.message);
  }

  /**
   * POST /api/clients/login/confirm
   * Confirm login with OTP: validate code, return client + wallet for session
   */
  @ApiOperation({ summary: 'Confirmar inicio de sesión con código OTP' })
  @Post('login/confirm')
  async confirmLoginOtp(@Body() dto: ConfirmLoginOtpDto) {
    const client = await this.clientsService.confirmLoginOtp(dto);

    return ApiResponse.success(
      {
        id: client.id,
        document: client.document,
        name: client.name,
        email: client.email,
        phone: client.phone,
        wallet: {
          id: client.wallet.id,
          balance: Number(client.wallet.balance),
        },
      },
      'Sesión iniciada correctamente',
    );
  }
}
