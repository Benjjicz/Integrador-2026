import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { EstadosProyectosEnum } from '../enums/estados-proyectos.enum';
import { ClienteEntity } from './cliente.entity';
import { TareaEntity } from './tarea.entity';

@Entity('proyectos')
export class ProyectoEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true, nullable: false })
  nombre!: string;

  @Column({ type: 'enum', enum: EstadosProyectosEnum, default: EstadosProyectosEnum.ACTIVO })
  estado!: EstadosProyectosEnum;

  @Column({ type: 'date', nullable: true, name: 'fechaFinalizacionObjetivo' })
  fechaFinalizacion!: Date | null;

  @ManyToOne(() => ClienteEntity, (cliente) => cliente.proyectos, { nullable: true })
  @JoinColumn({ name: 'id_cliente', referencedColumnName: 'id' })
  cliente!: ClienteEntity | null;

  @OneToMany(() => TareaEntity, (tarea) => tarea.proyecto)
  tareas!: TareaEntity[];
}