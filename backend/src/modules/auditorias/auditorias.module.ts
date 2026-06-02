import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditoriaEntity } from './entities/auditoria.entity';
import { AuditoriaController } from './controllers/auditoria.controller';
import { AuditoriaService } from './services/auditoria.service';



@Module({
  imports: [TypeOrmModule.forFeature([AuditoriaEntity])],
  controllers: [AuditoriaController],
  providers: [AuditoriaService],
})
export class AuditoriasModule {}