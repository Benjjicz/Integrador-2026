import { IsString, IsNotEmpty, IsOptional, IsInt, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProyectoDto {
  @ApiProperty({ description: 'Nombre único del proyecto' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiPropertyOptional({ description: 'ID del cliente asociado. Vacío si es un proyecto interno' })
  @IsOptional()
  @IsInt()
  idCliente?: number;

  @ApiPropertyOptional({ description: 'Fecha límite del proyecto. Formato: YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  fechaFinalizacion?: string;
}