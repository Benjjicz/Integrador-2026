import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EstadisticasService } from '../services/estadisticas.service';
import { AuthGuard } from '../../auth/guards/auth.guard';

@ApiTags('Estadísticas')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('estadisticas')
export class EstadisticasController {
  constructor(
    private readonly estadisticasService: EstadisticasService,
  ) {}

  @Get()
  obtenerEstadisticas() {
    return this.estadisticasService.obtenerEstadisticas();
  }
}