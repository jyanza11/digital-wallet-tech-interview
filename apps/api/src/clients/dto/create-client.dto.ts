import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty({ message: 'El documento es obligatorio' })
  @IsString({ message: 'El documento debe ser una cadena de texto' })
  @MinLength(5, { message: 'El documento debe tener al menos 5 caracteres' })
  document: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsNotEmpty({ message: 'El celular es obligatorio' })
  @IsString({ message: 'El celular debe ser una cadena de texto' })
  @MinLength(10, { message: 'El celular debe tener al menos 10 dígitos' })
  phone: string;
}
