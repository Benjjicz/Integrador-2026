import { ApiProperty } from "@nestjs/swagger";
import { EstadosClientesEnum } from "../../enums/estados-clientes.enum";

export class ListClienteDTO {

    @ApiProperty()
    id!: number;

    @ApiProperty()
    nombre!: string;

    @ApiProperty({ required: false })
    correo?: string;

    @ApiProperty({ required: false })
    telefono?: string;

    @ApiProperty()
    estado!: EstadosClientesEnum;

}