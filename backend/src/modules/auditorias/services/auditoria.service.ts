import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditoriaEntity } from '../entities/auditoria.entity';


@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(AuditoriaEntity)
    private readonly auditoriaRepository: Repository<AuditoriaEntity>,
  ) {}

  async obtenerHistorial(): Promise<AuditoriaEntity[]> {
    return await this.auditoriaRepository.find({
      order: { fecha: 'DESC' },
    });
  }



  private limpiarDatosCambio(datos: any, tipoEntidad: string, operacion: string): string {
    if (!datos) return 'Sin detalles';
    
    let objeto = datos;
    if (typeof datos === 'string') {
      try {
        objeto = JSON.parse(datos);
      } catch (e) {
        return datos.replace(/"/g, '""'); 
      }
    }

    let formatearDetalles = '';
    const op = operacion ? operacion.toUpperCase() : 'ACCION';

    switch (tipoEntidad ? tipoEntidad.toLowerCase() : '') {
      case 'clientes':
        formatearDetalles = op === 'INSERT' 
          ? `Se registró al cliente: ${objeto.nombre || 'Sin nombre'}` 
          : `Se actualizó el cliente: ${objeto.nombre || 'Sin nombre'} (Estado: ${objeto.estado || 'ACTIVO'})`;
        break;

      case 'proyectos':
        formatearDetalles = op === 'INSERT'
          ? `Se creó el proyecto: ${objeto.nombre || 'Sin nombre'}`
          : `Se modificó el proyecto: ${objeto.nombre || 'Sin nombre'} (Estado: ${objeto.estado || 'ACTIVO'})`;
        break;

      case 'tareas':
        formatearDetalles = op === 'INSERT'
          ? `Se creó la tarea: ${objeto.descripcion || 'Sin descripción'}`
          : `Se movió la tarea "${objeto.descripcion || 'Sin descripción'}" al estado [${(objeto.estado || 'PENDIENTE').toUpperCase()}]`;
        break;

      default:
        formatearDetalles = `${op} en ${tipoEntidad || 'Registro'}: ${objeto.nombre || objeto.descripcion || 'Ver ID'}`;
        break;
    }



    return `"${formatearDetalles.replace(/"/g, '""')}"`;
  }

  async generarCSV(): Promise<string> {
    const registros = await this.obtenerHistorial();
    
    const encabezados = 'ID;Fecha;Usuario;Modulo;ID Registro;Operacion;Detalles del Cambio\n';
    
    const filas = registros.map(item => {
      const id = item.id;
      const fecha = item.fecha ? new Date(item.fecha).toLocaleString('es-AR') : '';
      const usuario = item.nombre_usuario || 'Sistema';
      const modulo = (item.tipo_entidad || '').toUpperCase(); 
      const idReg = item.id_entidad || '';
      const operacion = item.tipo_operacion || '';
      const detalles = this.limpiarDatosCambio(item.datosCambio, item.tipo_entidad, item.tipo_operacion);

      return `${id};${fecha};${usuario};${modulo};${idReg};${operacion};${detalles}`;
    });

    return encabezados + filas.join('\n');
  }
}