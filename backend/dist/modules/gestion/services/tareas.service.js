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
exports.TareasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tarea_entity_1 = require("../entities/tarea.entity");
const proyecto_entity_1 = require("../entities/proyecto.entity");
const estados_tareas_enum_1 = require("../enums/estados-tareas.enum");
const estados_proyectos_enum_1 = require("../enums/estados-proyectos.enum");
let TareasService = class TareasService {
    constructor(tareaRepo, proyectoRepo) {
        this.tareaRepo = tareaRepo;
        this.proyectoRepo = proyectoRepo;
    }
    async crearTarea(dto) {
        const proyecto = await this.proyectoRepo.findOne({ where: { id: dto.idProyecto } });
        if (!proyecto) {
            throw new common_1.NotFoundException(`El proyecto con ID ${dto.idProyecto} no existe.`);
        }
        if (proyecto.estado === estados_proyectos_enum_1.EstadosProyectosEnum.BAJA) {
            throw new common_1.BadRequestException('No se pueden agregar tareas a un proyecto dado de baja.');
        }
        const nuevaTarea = this.tareaRepo.create({
            descripcion: dto.descripcion,
            estado: estados_tareas_enum_1.EstadosTareasEnum.PENDIENTE,
            proyecto: proyecto
        });
        const result = await this.tareaRepo.save(nuevaTarea);
        return { id: result.id };
    }
    async actualizarEstado(id, estado) {
        const tarea = await this.tareaRepo.findOne({ where: { id } });
        if (!tarea) {
            throw new common_1.NotFoundException(`Tarea con ID ${id} no encontrada.`);
        }
        tarea.estado = estado;
        return await this.tareaRepo.save(tarea);
    }
    async obtenerTareas(idProyecto) {
        const query = this.tareaRepo.createQueryBuilder('tarea')
            .leftJoinAndSelect('tarea.proyecto', 'proyecto');
        if (idProyecto) {
            query.where('proyecto.id = :idProyecto', { idProyecto });
        }
        return await query.orderBy('tarea.id', 'ASC').getMany();
    }
    async actualizarTarea(id, dto) {
        const tarea = await this.tareaRepo.findOne({ where: { id }, relations: ['proyecto'] });
        if (!tarea)
            throw new common_1.NotFoundException(`Tarea no encontrada.`);
        if (dto.descripcion)
            tarea.descripcion = dto.descripcion;
        if (dto.estado)
            tarea.estado = dto.estado;
        if (dto.idProyecto) {
            const proyecto = await this.proyectoRepo.findOne({ where: { id: dto.idProyecto } });
            if (!proyecto)
                throw new common_1.NotFoundException(`El proyecto destino no existe.`);
            if (proyecto.estado === estados_proyectos_enum_1.EstadosProyectosEnum.BAJA) {
                throw new common_1.BadRequestException('No se puede reasignar una tarea a un proyecto dado de baja.');
            }
            tarea.proyecto = proyecto;
        }
        await this.tareaRepo.save(tarea);
    }
    async eliminarTarea(id) {
        const tarea = await this.tareaRepo.findOne({ where: { id } });
        if (!tarea)
            throw new common_1.NotFoundException(`Tarea con ID ${id} no encontrada.`);
        await this.tareaRepo.remove(tarea);
    }
};
exports.TareasService = TareasService;
exports.TareasService = TareasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tarea_entity_1.TareaEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(proyecto_entity_1.ProyectoEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TareasService);
//# sourceMappingURL=tareas.service.js.map