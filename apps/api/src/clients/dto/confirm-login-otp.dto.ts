import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmLoginOtpDto {
  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Correo del cliente',
  })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Código OTP de 6 dígitos enviado al correo',
  })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @IsString()
  @Length(6, 6, { message: 'El código debe tener 6 dígitos' })
  @Matches(/^\d{6}$/, {
    message: 'El código debe ser solo números de 6 dígitos',
  })
  otp: string;
}
