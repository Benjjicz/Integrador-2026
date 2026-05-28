import { IsString, IsOptional, IsInt, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadosProyectosEnum } from '../../enums/estados-proyectos.enum';

export class UpdateProyectoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  idCliente?: number;

  @ApiPropertyOptional({ enum: EstadosProyectosEnum })
  @IsOptional()
  @IsEnum(EstadosProyectosEnum)
  estado?: EstadosProyectosEnum;

  @ApiPropertyOptional({ description: 'Fecha límite del proyecto. Formato: YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  fechaFinalizacion?: string;
}