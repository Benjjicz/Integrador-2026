import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { EstadosProyectosEnum } from "../../enums/estados-proyectos.enum";
import { ListTareaDTO } from "./list-tarea.dto";
import { ListClienteDTO } from "./list-cliente.dto";

export class ProyectoDTO {

    @ApiProperty()
    id!: number;

    @ApiProperty()
    nombre!: string;

    @ApiProperty()
    estado!: EstadosProyectosEnum;

    @ApiPropertyOptional({ type: () => ListClienteDTO })
    cliente?: ListClienteDTO | null;

    @ApiProperty({ type: () => ListTareaDTO, isArray: true })
    tareas!: ListTareaDTO[];

}