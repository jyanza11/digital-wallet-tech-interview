import { Controller, Post, Body } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto';
import { ApiResponse } from '../common';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

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
}
