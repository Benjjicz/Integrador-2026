import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';
import { ProyectoEntity } from './proyecto.entity';

@Entity('clientes')
export class ClienteEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true, nullable: false })
  nombre!: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  correo?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefono?: string;


  @Column({ type: 'enum', enum: EstadosClientesEnum, default: EstadosClientesEnum.ACTIVO })
  estado!: EstadosClientesEnum;

  @OneToMany(() => ProyectoEntity, (proyecto) => proyecto.cliente)
  proyectos!: ProyectoEntity[];
}