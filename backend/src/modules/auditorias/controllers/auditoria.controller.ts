import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuditoriaService } from '../services/auditoria.service';

@Controller('auditorias')
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  
  
  @Get()
  async verHistorial(@Res() res: Response) {
    try {
      const datos = await this.auditoriaService.obtenerHistorial();
      return res.status(HttpStatus.OK).json(datos);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al obtener la auditoría',
      });
    }
  }




  @Get('exportar')
  async exportarCSV(@Res() res: Response) {
    try {
      const csvData = await this.auditoriaService.generarCSV();
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=auditoria.csv');
      return res.status(HttpStatus.OK).send(csvData);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al exportar el archivo',
      });
    }
  }
}