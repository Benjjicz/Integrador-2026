import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module"; 
import { ClientesController } from "./controllers/clientes.controller";
import { ProyectosController } from "./controllers/proyectos.controller";
import { TareasController } from "./controllers/tareas.controller";
import { ClientesService } from "./services/clientes.service";
import { ProyectosService } from "./services/proyectos.service"; 
import { TareasService } from "./services/tareas.service"; 
import { ClienteEntity } from "./entities/cliente.entity";
import { ProyectoEntity } from "./entities/proyecto.entity";
import { TareaEntity } from "./entities/tarea.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ClienteEntity, ProyectoEntity, TareaEntity]),
        AuthModule 
    ],
    controllers: [ClientesController, ProyectosController, TareasController], 
    providers: [ClientesService, ProyectosService, TareasService], 
    
    exports: [TareasService, ProyectosService, ClientesService], 
})
export class GestionModule {}