"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cliente_entity_1 = require("../entities/cliente.entity");
const estados_clientes_enum_1 = require("../enums/estados-clientes.enum");
const estados_proyectos_enum_1 = require("../enums/estados-proyectos.enum");
let ClientesService = class ClientesService {
    constructor(clienteRepo) {
        this.clienteRepo = clienteRepo;
    }
    async crearCliente(dto) {
        const existe = await this.clienteRepo.findOne({ where: { nombre: dto.nombre } });
        if (existe) {
            throw new common_1.ConflictException(`El cliente '${dto.nombre}' ya está registrado.`);
        }
        const cliente = this.clienteRepo.create({
            nombre: dto.nombre,
            correo: dto.correo,
            telefono: dto.telefono,
            estado: estados_clientes_enum_1.EstadosClientesEnum.ACTIVO
        });
        const guardado = await this.clienteRepo.save(cliente);
        return { id: guardado.id };
    }
    async obtenerClientes(estado) {
        const query = this.clienteRepo.createQueryBuilder('cliente');
        if (estado)
            query.where('cliente.estado = :estado', { estado });
        return await query.orderBy('cliente.id', 'ASC').getMany();
    }
    async actualizarCliente(id, dto) {
        const cliente = await this.clienteRepo.findOne({
            where: { id },
            relations: ['proyectos']
        });
        if (!cliente)
            throw new common_1.NotFoundException(`Cliente no encontrado.`);
        if (dto.estado === estados_clientes_enum_1.EstadosClientesEnum.BAJA && cliente.estado !== estados_clientes_enum_1.EstadosClientesEnum.BAJA) {
            const proyectosActivos = cliente.proyectos?.filter(p => p.estado !== estados_proyectos_enum_1.EstadosProyectosEnum.BAJA) ?? [];
            if (proyectosActivos.length > 0) {
                throw new common_1.BadRequestException('No se puede dar de baja un cliente con proyectos activos o finalizados asociados.');
            }
        }
        if (dto.nombre)
            cliente.nombre = dto.nombre;
        if (dto.estado)
            cliente.estado = dto.estado;
        if (dto.correo !== undefined)
            cliente.correo = dto.correo;
        if (dto.telefono !== undefined)
            cliente.telefono = dto.telefono;
        try {
            await this.clienteRepo.save(cliente);
        }
        catch (error) {
            throw new common_1.ConflictException('El nombre del cliente ya está en uso.');
        }
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cliente_entity_1.ClienteEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClientesService);
//# sourceMappingURL=clientes.service.js.map