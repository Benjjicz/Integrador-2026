import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoEntity } from '../entities/proyecto.entity';
import { ClienteEntity } from '../entities/cliente.entity';
import { CreateProyectoDto } from '../dtos/input/create-proyecto.dto';
import { UpdateProyectoDto } from '../dtos/input/update-proyecto.dto';
import { EstadosProyectosEnum } from '../enums/estados-proyectos.enum';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepo: Repository<ProyectoEntity>,
    @InjectRepository(ClienteEntity)
    private readonly clienteRepo: Repository<ClienteEntity>,
  ) {}

  async crearProyecto(dto: CreateProyectoDto): Promise<{ id: number }> {
    const existe = await this.proyectoRepo.findOne({ where: { nombre: dto.nombre } });
    if (existe) {
      throw new ConflictException(`El proyecto '${dto.nombre}' ya existe.`);
    }

    const nuevoProyecto = this.proyectoRepo.create({
      nombre: dto.nombre,
      estado: EstadosProyectosEnum.ACTIVO,
    });

    if (dto.idCliente) {
      const cliente = await this.clienteRepo.findOne({ where: { id: dto.idCliente } });
      if (!cliente) {
        throw new NotFoundException(`Cliente con ID ${dto.idCliente} no encontrado.`);
      }
      if (cliente.estado !== EstadosClientesEnum.ACTIVO) {
        throw new BadRequestException('Solo se pueden asociar clientes en estado ACTIVO a un proyecto.');
      }
      nuevoProyecto.cliente = cliente as any;
    }

    const guardado = await this.proyectoRepo.save(nuevoProyecto);
    return { id: guardado.id };
  }

  async actualizarProyecto(id: number, dto: UpdateProyectoDto): Promise<void> {
    console.log('DTO recibido:', dto);
    const proyecto = await this.proyectoRepo.findOne({ where: { id } });
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado.`);
    }

    if (dto.nombre) {
      const existeNombre = await this.proyectoRepo.findOne({ where: { nombre: dto.nombre } });
      if (existeNombre && existeNombre.id !== id) {
        throw new ConflictException(`Ya existe otro proyecto con el nombre '${dto.nombre}'.`);
      }
      proyecto.nombre = dto.nombre;
    }

    if (dto.estado) proyecto.estado = dto.estado;

    if (dto.idCliente !== undefined) {
      if (!dto.idCliente) {
        proyecto.cliente = null as any;
      } else {
        const cliente = await this.clienteRepo.findOne({ where: { id: dto.idCliente } });
        if (!cliente) throw new NotFoundException(`Cliente no encontrado.`);
        if (cliente.estado !== EstadosClientesEnum.ACTIVO) {
          throw new BadRequestException('Solo se pueden asociar clientes en estado ACTIVO a un proyecto.');
        }
        proyecto.cliente = cliente as any;
      }
    }

    if (dto.fechaFinalizacion !== undefined) {
      proyecto.fechaFinalizacion = dto.fechaFinalizacion ? new Date(dto.fechaFinalizacion) : null;
    }

    await this.proyectoRepo.save(proyecto);
  }

  async obtenerProyectos(estado?: EstadosProyectosEnum): Promise<ProyectoEntity[]> {
    const query = this.proyectoRepo.createQueryBuilder('proyecto')
      .leftJoinAndSelect('proyecto.cliente', 'cliente')
      .leftJoinAndSelect('proyecto.tareas', 'tareas');

    if (estado) {
      query.where('proyecto.estado = :estado', { estado });
    }

    return await query.orderBy('proyecto.id', 'ASC').getMany();
  }
}