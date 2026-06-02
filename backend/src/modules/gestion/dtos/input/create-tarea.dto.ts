import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTareaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  idProyecto!: number; 
}