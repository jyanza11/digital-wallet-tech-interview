import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestLoginOtpDto {
  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Correo del cliente',
  })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @ApiProperty({ example: '9999999999', description: 'Documento del cliente' })
  @IsNotEmpty({ message: 'El documento es obligatorio' })
  @IsString()
  @MinLength(5, { message: 'El documento debe tener al menos 5 caracteres' })
  document: string;

  @ApiProperty({ example: '3001234567', description: 'Celular del cliente' })
  @IsNotEmpty({ message: 'El celular es obligatorio' })
  @IsString()
  @MinLength(10, { message: 'El celular debe tener al menos 10 dígitos' })
  phone: string;
}
