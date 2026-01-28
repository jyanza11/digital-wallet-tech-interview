import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class RechargeWalletDto {
  @IsNotEmpty({ message: 'El documento es obligatorio' })
  @IsString({ message: 'El documento debe ser una cadena de texto' })
  document: string;

  @IsNotEmpty({ message: 'El celular es obligatorio' })
  @IsString({ message: 'El celular debe ser una cadena de texto' })
  phone: string;

  @IsNotEmpty({ message: 'El valor es obligatorio' })
  @IsNumber({}, { message: 'El valor debe ser un número' })
  @IsPositive({ message: 'El valor debe ser positivo' })
  @Min(1000, { message: 'El valor mínimo de recarga es $1,000' })
  amount: number;
}
