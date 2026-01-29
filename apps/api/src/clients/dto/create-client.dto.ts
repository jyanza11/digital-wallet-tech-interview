import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: '9999999999', description: 'Documento del cliente' })
  @IsNotEmpty({ message: 'El documento es obligatorio' })
  @IsString({ message: 'El documento debe ser una cadena de texto' })
  @MinLength(5, { message: 'El documento debe tener al menos 5 caracteres' })
  document: string;

  @ApiProperty({ example: 'Juan Perez', description: 'Nombre completo' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  name: string;

  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Correo del cliente',
  })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @ApiProperty({ example: '3001234567', description: 'Telefono/celular' })
  @IsNotEmpty({ message: 'El celular es obligatorio' })
  @IsString({ message: 'El celular debe ser una cadena de texto' })
  @MinLength(10, { message: 'El celular debe tener al menos 10 dígitos' })
  phone: string;
}
