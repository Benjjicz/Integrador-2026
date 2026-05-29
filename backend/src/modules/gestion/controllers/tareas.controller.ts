import { Body, Controller, Get, Param, Post, Put, Delete, Query, ParseIntPipe, UseGuards, Patch } from "@nestjs/common";
import { CreateTareaDto } from "../dtos/input/create-tarea.dto";
import { UpdateTareaDto } from "../dtos/input/update-tarea.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { TareasService } from "../services/tareas.service";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { EstadosTareasEnum } from "../enums/estados-tareas.enum"; 

@ApiTags('Tareas')
@Controller('tareas')
export class TareasController {

    constructor(private readonly tareasService: TareasService) {}

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post()
    async crearTarea(@Body() dto: CreateTareaDto): Promise<{ id: number }> {
        return await this.tareasService.crearTarea(dto);
    }

    // ---  ENDPOINT PARA EL KANBAN ---
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Patch(":id/estado")
    async actualizarEstado(
        @Param("id", ParseIntPipe) id: number, 
        @Body("estado") estado: EstadosTareasEnum
    ) {
        return await this.tareasService.actualizarEstado(id, estado);
    }
    // -------------------------------------

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put(":id")
    async actualizarTarea(
        @Param("id", ParseIntPipe) id: number, 
        @Body() dto: UpdateTareaDto
    ): Promise<void> {
        await this.tareasService.actualizarTarea(id, dto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Delete(":id")
    async eliminarTarea(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.tareasService.eliminarTarea(id);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get()
    async obtenerTareas(@Query("idProyecto") idProyecto?: number) {
        const tareas = await this.tareasService.obtenerTareas(idProyecto);
        return tareas.map(t => ({
            id: t.id,
            descripcion: t.descripcion,
            estado: t.estado,
            proyecto: t.proyecto ? { id: t.proyecto.id, nombre: t.proyecto.nombre } : null
        })); 
    }
}