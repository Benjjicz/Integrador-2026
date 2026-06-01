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
exports.ProyectosController = void 0;
const common_1 = require("@nestjs/common");
const create_proyecto_dto_1 = require("../dtos/input/create-proyecto.dto");
const update_proyecto_dto_1 = require("../dtos/input/update-proyecto.dto");
const swagger_1 = require("@nestjs/swagger");
const list_proyecto_dto_1 = require("../dtos/output/list-proyecto.dto");
const estados_proyectos_enum_1 = require("../enums/estados-proyectos.enum");
const proyectos_service_1 = require("../services/proyectos.service");
const auth_guard_1 = require("../../auth/guards/auth.guard");
let ProyectosController = class ProyectosController {
    constructor(proyectosService) {
        this.proyectosService = proyectosService;
    }
    async crearProyecto(dto) {
        return await this.proyectosService.crearProyecto(dto);
    }
    async actualizarProyecto(id, dto) {
        await this.proyectosService.actualizarProyecto(id, dto);
    }
    async actualizarProyectoParcial(id, dto) {
        await this.proyectosService.actualizarProyecto(id, dto);
    }
    async obtenerProyectos(estado) {
        const proyectos = await this.proyectosService.obtenerProyectos(estado);
        return proyectos.map(p => ({
            id: p.id,
            nombre: p.nombre,
            estado: p.estado,
            fechaFinalizacion: p.fechaFinalizacion ?? null,
            cliente: p.cliente ? { id: p.cliente.id, nombre: p.cliente.nombre } : null
        }));
    }
};
exports.ProyectosController = ProyectosController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_proyecto_dto_1.CreateProyectoDto]),
    __metadata("design:returntype", Promise)
], ProyectosController.prototype, "crearProyecto", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_proyecto_dto_1.UpdateProyectoDto]),
    __metadata("design:returntype", Promise)
], ProyectosController.prototype, "actualizarProyecto", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_proyecto_dto_1.UpdateProyectoDto]),
    __metadata("design:returntype", Promise)
], ProyectosController.prototype, "actualizarProyectoParcial", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOkResponse)({ type: list_proyecto_dto_1.ListProyectoDTO, isArray: true }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("estado")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProyectosController.prototype, "obtenerProyectos", null);
exports.ProyectosController = ProyectosController = __decorate([
    (0, swagger_1.ApiTags)('Proyectos'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('proyectos'),
    __metadata("design:paramtypes", [proyectos_service_1.ProyectosService])
], ProyectosController);
//# sourceMappingURL=proyectos.controller.js.map