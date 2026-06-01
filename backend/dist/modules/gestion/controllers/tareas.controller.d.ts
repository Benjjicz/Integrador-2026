import { CreateTareaDto } from "../dtos/input/create-tarea.dto";
import { UpdateTareaDto } from "../dtos/input/update-tarea.dto";
import { TareasService } from "../services/tareas.service";
import { EstadosTareasEnum } from "../enums/estados-tareas.enum";
export declare class TareasController {
    private readonly tareasService;
    constructor(tareasService: TareasService);
    crearTarea(dto: CreateTareaDto): Promise<{
        id: number;
    }>;
    actualizarEstado(id: number, estado: EstadosTareasEnum): Promise<import("../entities/tarea.entity").TareaEntity>;
    actualizarTarea(id: number, dto: UpdateTareaDto): Promise<void>;
    actualizarTareaParcial(id: number, dto: UpdateTareaDto): Promise<void>;
    eliminarTarea(id: number): Promise<void>;
    obtenerTareas(idProyecto?: number): Promise<{
        id: number;
        descripcion: string;
        estado: EstadosTareasEnum;
        proyecto: {
            id: number;
            nombre: string;
        };
    }[]>;
}
