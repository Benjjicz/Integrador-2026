import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EstadosUsuariosEnum } from '../enums/estados-usuarios.enum';

@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false, name: 'usuario' })
  usuario!: string;

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'clave' })
  clave!: string;

  @Column({ type: 'varchar', length: 50, default: EstadosUsuariosEnum.ACTIVO, name: 'estado' })
  estado!: EstadosUsuariosEnum;
}