import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProyectoEntity } from '../../gestion/entities/proyecto.entity';
import { ClienteEntity } from '../../gestion/entities/cliente.entity';
import { TareaEntity } from '../../gestion/entities/tarea.entity';

import { EstadosProyectosEnum } from '../../gestion/enums/estados-proyectos.enum';
import { EstadosTareasEnum } from '../../gestion/enums/estados-tareas.enum';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepo: Repository<ProyectoEntity>,

    @InjectRepository(ClienteEntity)
    private readonly clienteRepo: Repository<ClienteEntity>,

    @InjectRepository(TareaEntity)
    private readonly tareaRepo: Repository<TareaEntity>,
  ) {}

  async obtenerEstadisticas() {
    const proyectosActivos = await this.proyectoRepo.count({
      where: { estado: EstadosProyectosEnum.ACTIVO },
    });

    const proyectosFinalizados = await this.proyectoRepo.count({
      where: { estado: EstadosProyectosEnum.FINALIZADO },
    });

    const tareasPendientes = await this.tareaRepo.count({
      where: { estado: EstadosTareasEnum.PENDIENTE },
    });

    const tareasFinalizadas = await this.tareaRepo.count({
      where: { estado: EstadosTareasEnum.FINALIZADA },
    });

    const clientesActivos = await this.clienteRepo.count();

    const proyectosPorCliente = await this.proyectoRepo
      .createQueryBuilder('p')
      .leftJoin('p.cliente', 'c')
      .select('c.nombre', 'cliente')
      .addSelect('COUNT(p.id)', 'cantidad')
      .groupBy('c.nombre')
      .getRawMany();

    return {
      proyectosActivos,
      proyectosFinalizados,
      tareasPendientes,
      tareasFinalizadas,
      clientesActivos,
      proyectosPorCliente,
    };
  }
}