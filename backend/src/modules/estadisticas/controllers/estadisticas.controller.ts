import { Controller, Get } from '@nestjs/common';
import { EstadisticasService } from '../services/estadisticas.service';

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