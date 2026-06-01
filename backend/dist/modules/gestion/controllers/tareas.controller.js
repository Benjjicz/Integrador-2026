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
exports.TareasController = void 0;
const common_1 = require("@nestjs/common");
const create_tarea_dto_1 = require("../dtos/input/create-tarea.dto");
const update_tarea_dto_1 = require("../dtos/input/update-tarea.dto");
const swagger_1 = require("@nestjs/swagger");
const tareas_service_1 = require("../services/tareas.service");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const estados_tareas_enum_1 = require("../enums/estados-tareas.enum");
let TareasController = class TareasController {
    constructor(tareasService) {
        this.tareasService = tareasService;
    }
    async crearTarea(dto) {
        return await this.tareasService.crearTarea(dto);
    }
    async actualizarEstado(id, estado) {
        return await this.tareasService.actualizarEstado(id, estado);
    }
    async actualizarTarea(id, dto) {
        await this.tareasService.actualizarTarea(id, dto);
    }
    async actualizarTareaParcial(id, dto) {
        await this.tareasService.actualizarTarea(id, dto);
    }
    async eliminarTarea(id) {
        await this.tareasService.eliminarTarea(id);
    }
    async obtenerTareas(idProyecto) {
        const tareas = await this.tareasService.obtenerTareas(idProyecto);
        return tareas.map(t => ({
            id: t.id,
            descripcion: t.descripcion,
            estado: t.estado,
            proyecto: t.proyecto ? { id: t.proyecto.id, nombre: t.proyecto.nombre } : null
        }));
    }
};
exports.TareasController = TareasController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tarea_dto_1.CreateTareaDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "crearTarea", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(":id/estado"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)("estado")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "actualizarEstado", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_tarea_dto_1.UpdateTareaDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "actualizarTarea", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_tarea_dto_1.UpdateTareaDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "actualizarTareaParcial", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "eliminarTarea", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("idProyecto", new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "obtenerTareas", null);
exports.TareasController = TareasController = __decorate([
    (0, swagger_1.ApiTags)('Tareas'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('tareas'),
    __metadata("design:paramtypes", [tareas_service_1.TareasService])
], TareasController);
//# sourceMappingURL=tareas.controller.js.map