import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestPaymentDto {
  @ApiProperty({ example: '9999999999', description: 'Documento del cliente' })
  @IsNotEmpty({ message: 'El documento es requerido' })
  @IsString({ message: 'El documento debe ser una cadena de texto' })
  document: string;

  @ApiProperty({ example: '3001234567', description: 'Telefono/celular' })
  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  phone: string;

  @ApiProperty({ example: 50, description: 'Monto del pago (COP)' })
  @IsNotEmpty({ message: 'El monto es requerido' })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @Min(1, { message: 'El monto mínimo es $1' })
  amount: number;
}
