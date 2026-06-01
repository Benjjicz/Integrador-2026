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
exports.ClientesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_cliente_dto_1 = require("../dtos/input/create-cliente.dto");
const update_cliente_dto_1 = require("../dtos/input/update-cliente.dto");
const list_cliente_dto_1 = require("../dtos/output/list-cliente.dto");
const estados_clientes_enum_1 = require("../enums/estados-clientes.enum");
const clientes_service_1 = require("../services/clientes.service");
const auth_guard_1 = require("../../auth/guards/auth.guard");
let ClientesController = class ClientesController {
    constructor(clientesService) {
        this.clientesService = clientesService;
    }
    async crearCliente(dto) {
        return await this.clientesService.crearCliente(dto);
    }
    async actualizarCliente(id, dto) {
        await this.clientesService.actualizarCliente(id, dto);
    }
    async actualizarClienteParcial(id, dto) {
        await this.clientesService.actualizarCliente(id, dto);
    }
    async obtenerClientes(estado) {
        const clientes = await this.clientesService.obtenerClientes(estado);
        return clientes.map(cliente => ({
            id: cliente.id,
            nombre: cliente.nombre,
            correo: cliente.correo,
            telefono: cliente.telefono,
            estado: cliente.estado
        }));
    }
};
exports.ClientesController = ClientesController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cliente_dto_1.CreateClienteDto]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "crearCliente", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_cliente_dto_1.UpdateClienteDto]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "actualizarCliente", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_cliente_dto_1.UpdateClienteDto]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "actualizarClienteParcial", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOkResponse)({ type: list_cliente_dto_1.ListClienteDTO, isArray: true }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("estado")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "obtenerClientes", null);
exports.ClientesController = ClientesController = __decorate([
    (0, swagger_1.ApiTags)('Clientes'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('clientes'),
    __metadata("design:paramtypes", [clientes_service_1.ClientesService])
], ClientesController);
//# sourceMappingURL=clientes.controller.js.map