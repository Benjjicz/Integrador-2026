import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { EstadosProyectosEnum } from "../../enums/estados-proyectos.enum";
import { ListClienteDTO } from "./list-cliente.dto";

export class ListProyectoDTO {

    @ApiProperty()
    id!: number;

    @ApiProperty()
    nombre!: string;

    @ApiProperty()
    estado!: EstadosProyectosEnum;

    @ApiPropertyOptional({ type: () => ListClienteDTO })
    cliente?: ListClienteDTO | null;

}