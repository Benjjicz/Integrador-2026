import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';


@Entity({ name: 'auditorias', schema: 'public' })
export class AuditoriaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_usuario', default: 1 })
  id_usuario: number;

  @Column({ name: 'nombre_usuario', length: 100, default: 'Sistema' })
  nombre_usuario: string;

  @Column({ name: 'tipo_entidad' })
  tipo_entidad: string;

  @Column({ name: 'id_entidad' })
  id_entidad: number;

  @Column({ name: 'tipo_operacion', length: 20 })
  tipo_operacion: string;

  @Column({ type: 'jsonb', nullable: true })
  datosCambio: any;

  @CreateDateColumn({ type: 'timestamp' })
  fecha: Date;
}