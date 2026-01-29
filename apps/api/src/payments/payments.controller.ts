import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { RequestPaymentDto, ConfirmPaymentDto } from './dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * POST /api/payments/request
   * Request a new payment - generates OTP and sends to client's email
   */
  @ApiOperation({ summary: 'Solicitar pago (genera OTP)' })
  @Post('request')
  async requestPayment(@Body() requestDto: RequestPaymentDto) {
    return this.paymentsService.requestPayment(requestDto);
  }

  /**
   * POST /api/payments/confirm
   * Confirm a payment with OTP token
   */
  @ApiOperation({ summary: 'Confirmar pago con OTP' })
  @Post('confirm')
  async confirmPayment(@Body() confirmDto: ConfirmPaymentDto) {
    return this.paymentsService.confirmPayment(confirmDto);
  }

  /**
   * GET /api/payments/session/:id
   * Get payment session status
   */
  @ApiOperation({ summary: 'Consultar estado de sesion de pago' })
  @Get('session/:id')
  async getSessionStatus(@Param('id') sessionId: string) {
    return this.paymentsService.getSessionStatus(sessionId);
  }
}
