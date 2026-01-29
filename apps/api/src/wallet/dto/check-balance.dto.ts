import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckBalanceDto {
  @ApiProperty({ example: '9999999999', description: 'Documento del cliente' })
  @IsNotEmpty({ message: 'El documento es obligatorio' })
  @IsString({ message: 'El documento debe ser una cadena de texto' })
  document: string;

  @ApiProperty({ example: '3001234567', description: 'Telefono/celular' })
  @IsNotEmpty({ message: 'El celular es obligatorio' })
  @IsString({ message: 'El celular debe ser una cadena de texto' })
  phone: string;
}
