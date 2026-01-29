import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmPaymentDto {
  @ApiProperty({
    example: 'uuid-session-id',
    description: 'ID de la sesion de pago',
  })
  @IsNotEmpty({ message: 'El ID de sesión es requerido' })
  @IsString({ message: 'El ID de sesión debe ser una cadena de texto' })
  sessionId: string;

  @ApiProperty({ example: '123456', description: 'Token OTP de 6 digitos' })
  @IsNotEmpty({ message: 'El token es requerido' })
  @IsString({ message: 'El token debe ser una cadena de texto' })
  @Length(6, 6, { message: 'El token debe tener exactamente 6 dígitos' })
  token: string;
}
