import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EstadisticasController } from './controllers/estadisticas.controller';
import { EstadisticasService } from './services/estadisticas.service';

import { ProyectoEntity } from '../gestion/entities/proyecto.entity';
import { ClienteEntity } from '../gestion/entities/cliente.entity';
import { TareaEntity } from '../gestion/entities/tarea.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProyectoEntity,
      ClienteEntity,
      TareaEntity,
    ]),
  ],
  controllers: [EstadisticasController],
  providers: [EstadisticasService],
})
export class EstadisticasModule {}