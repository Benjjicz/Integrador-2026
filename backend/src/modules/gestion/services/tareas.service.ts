import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TareaEntity } from '../entities/tarea.entity';
import { ProyectoEntity } from '../entities/proyecto.entity';
import { CreateTareaDto } from '../dtos/input/create-tarea.dto';
import { UpdateTareaDto } from '../dtos/input/update-tarea.dto';
import { EstadosTareasEnum } from '../enums/estados-tareas.enum';
import { EstadosProyectosEnum } from '../enums/estados-proyectos.enum';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(TareaEntity)
    private readonly tareaRepo: Repository<TareaEntity>,
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepo: Repository<ProyectoEntity>,
  ) {}

  async crearTarea(dto: CreateTareaDto): Promise<{ id: number }> {
    const proyecto = await this.proyectoRepo.findOne({ where: { id: dto.idProyecto } });
    if (!proyecto) {
      throw new NotFoundException(`El proyecto con ID ${dto.idProyecto} no existe.`);
    }

    if (proyecto.estado === EstadosProyectosEnum.BAJA) {
      throw new BadRequestException('No se pueden agregar tareas a un proyecto dado de baja.');
    }

    const nuevaTarea = this.tareaRepo.create({
      descripcion: dto.descripcion,
      estado: EstadosTareasEnum.PENDIENTE,
      proyecto: proyecto
    });

    const result = await this.tareaRepo.save(nuevaTarea);
    return { id: result.id };
  }

  async actualizarEstado(id: number, estado: EstadosTareasEnum): Promise<TareaEntity> {
    const tarea = await this.tareaRepo.findOne({ where: { id } });
    if (!tarea) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada.`);
    }

    tarea.estado = estado;
    return await this.tareaRepo.save(tarea);
  }

  async obtenerTareas(idProyecto?: number): Promise<TareaEntity[]> {
    const query = this.tareaRepo.createQueryBuilder('tarea')
      .leftJoinAndSelect('tarea.proyecto', 'proyecto');

    if (idProyecto) {
      query.where('proyecto.id = :idProyecto', { idProyecto });
    }

    return await query.orderBy('tarea.id', 'ASC').getMany();
  }

  async actualizarTarea(id: number, dto: UpdateTareaDto): Promise<void> {
    const tarea = await this.tareaRepo.findOne({ where: { id }, relations: ['proyecto'] });
    if (!tarea) throw new NotFoundException(`Tarea no encontrada.`);

    if (dto.descripcion) tarea.descripcion = dto.descripcion;
    if (dto.estado) tarea.estado = dto.estado;

    if (dto.idProyecto) {
      const proyecto = await this.proyectoRepo.findOne({ where: { id: dto.idProyecto } });
      if (!proyecto) throw new NotFoundException(`El proyecto destino no existe.`);
      if (proyecto.estado === EstadosProyectosEnum.BAJA) {
        throw new BadRequestException('No se puede reasignar una tarea a un proyecto dado de baja.');
      }
      tarea.proyecto = proyecto;
    }

    await this.tareaRepo.save(tarea);
  }

  async eliminarTarea(id: number): Promise<void> {
    const tarea = await this.tareaRepo.findOne({ where: { id } });
    if (!tarea) throw new NotFoundException(`Tarea con ID ${id} no encontrada.`);
    await this.tareaRepo.remove(tarea);
  }
}