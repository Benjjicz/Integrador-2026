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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioEntity = void 0;
const typeorm_1 = require("typeorm");
const estados_usuarios_enum_1 = require("../enums/estados-usuarios.enum");
let UsuarioEntity = class UsuarioEntity {
};
exports.UsuarioEntity = UsuarioEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UsuarioEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', unique: true, nullable: false, name: 'usuario' }),
    __metadata("design:type", String)
], UsuarioEntity.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false, name: 'clave' }),
    __metadata("design:type", String)
], UsuarioEntity.prototype, "clave", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: estados_usuarios_enum_1.EstadosUsuariosEnum, default: estados_usuarios_enum_1.EstadosUsuariosEnum.ACTIVO, name: 'estado' }),
    __metadata("design:type", String)
], UsuarioEntity.prototype, "estado", void 0);
exports.UsuarioEntity = UsuarioEntity = __decorate([
    (0, typeorm_1.Entity)('usuarios')
], UsuarioEntity);
//# sourceMappingURL=usuario.entity.js.map