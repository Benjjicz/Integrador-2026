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
exports.ProyectosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const proyecto_entity_1 = require("../entities/proyecto.entity");
const cliente_entity_1 = require("../entities/cliente.entity");
const estados_proyectos_enum_1 = require("../enums/estados-proyectos.enum");
const estados_clientes_enum_1 = require("../enums/estados-clientes.enum");
let ProyectosService = class ProyectosService {
    constructor(proyectoRepo, clienteRepo) {
        this.proyectoRepo = proyectoRepo;
        this.clienteRepo = clienteRepo;
    }
    async crearProyecto(dto) {
        const existe = await this.proyectoRepo.findOne({ where: { nombre: dto.nombre } });
        if (existe) {
            throw new common_1.ConflictException(`El proyecto '${dto.nombre}' ya existe.`);
        }
        const nuevoProyecto = this.proyectoRepo.create({
            nombre: dto.nombre,
            estado: estados_proyectos_enum_1.EstadosProyectosEnum.ACTIVO,
        });
        if (dto.idCliente) {
            const cliente = await this.clienteRepo.findOne({ where: { id: dto.idCliente } });
            if (!cliente) {
                throw new common_1.NotFoundException(`Cliente con ID ${dto.idCliente} no encontrado.`);
            }
            if (cliente.estado !== estados_clientes_enum_1.EstadosClientesEnum.ACTIVO) {
                throw new common_1.BadRequestException('Solo se pueden asociar clientes en estado ACTIVO a un proyecto.');
            }
            nuevoProyecto.cliente = cliente;
        }
        if (dto.fechaFinalizacion) {
            nuevoProyecto.fechaFinalizacion = new Date(dto.fechaFinalizacion);
        }
        const guardado = await this.proyectoRepo.save(nuevoProyecto);
        return { id: guardado.id };
    }
    async actualizarProyecto(id, dto) {
        const proyecto = await this.proyectoRepo.findOne({ where: { id } });
        if (!proyecto) {
            throw new common_1.NotFoundException(`Proyecto con ID ${id} no encontrado.`);
        }
        if (dto.nombre) {
            const existeNombre = await this.proyectoRepo.findOne({ where: { nombre: dto.nombre } });
            if (existeNombre && existeNombre.id !== id) {
                throw new common_1.ConflictException(`Ya existe otro proyecto con el nombre '${dto.nombre}'.`);
            }
            proyecto.nombre = dto.nombre;
        }
        if (dto.estado)
            proyecto.estado = dto.estado;
        if (dto.idCliente !== undefined) {
            if (!dto.idCliente) {
                proyecto.cliente = null;
            }
            else {
                const cliente = await this.clienteRepo.findOne({ where: { id: dto.idCliente } });
                if (!cliente)
                    throw new common_1.NotFoundException(`Cliente no encontrado.`);
                if (cliente.estado !== estados_clientes_enum_1.EstadosClientesEnum.ACTIVO) {
                    throw new common_1.BadRequestException('Solo se pueden asociar clientes en estado ACTIVO a un proyecto.');
                }
                proyecto.cliente = cliente;
            }
        }
        if (dto.fechaFinalizacion !== undefined) {
            proyecto.fechaFinalizacion = dto.fechaFinalizacion
                ? new Date(dto.fechaFinalizacion)
                : null;
        }
        await this.proyectoRepo.save(proyecto);
    }
    async obtenerProyectos(estado) {
        const query = this.proyectoRepo.createQueryBuilder('proyecto')
            .leftJoinAndSelect('proyecto.cliente', 'cliente')
            .leftJoinAndSelect('proyecto.tareas', 'tareas');
        if (estado) {
            query.where('proyecto.estado = :estado', { estado });
        }
        return await query.orderBy('proyecto.id', 'ASC').getMany();
    }
};
exports.ProyectosService = ProyectosService;
exports.ProyectosService = ProyectosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(proyecto_entity_1.ProyectoEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(cliente_entity_1.ClienteEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProyectosService);
//# sourceMappingURL=proyectos.service.js.map