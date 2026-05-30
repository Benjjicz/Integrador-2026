import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ description: 'Nombre de usuario para el inicio de sesión' })
  @IsString()
  @IsNotEmpty()
  usuario!: string; 

  @ApiProperty({ description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty()
  clave!: string;
}