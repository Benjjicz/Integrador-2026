import { CreateClienteDto } from "../dtos/input/create-cliente.dto";
import { UpdateClienteDto } from "../dtos/input/update-cliente.dto";
import { ListClienteDTO } from "../dtos/output/list-cliente.dto";
import { EstadosClientesEnum } from "../enums/estados-clientes.enum";
import { ClientesService } from "../services/clientes.service";
export declare class ClientesController {
    private readonly clientesService;
    constructor(clientesService: ClientesService);
    crearCliente(dto: CreateClienteDto): Promise<{
        id: number;
    }>;
    actualizarCliente(id: number, dto: UpdateClienteDto): Promise<void>;
    actualizarClienteParcial(id: number, dto: UpdateClienteDto): Promise<void>;
    obtenerClientes(estado?: EstadosClientesEnum): Promise<ListClienteDTO[]>;
}
