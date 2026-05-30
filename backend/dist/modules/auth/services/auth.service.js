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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const usuario_entity_1 = require("../entities/usuario.entity");
const estados_usuarios_enum_1 = require("../enums/estados-usuarios.enum");
let AuthService = class AuthService {
    constructor(usuarioRepo, jwtService) {
        this.usuarioRepo = usuarioRepo;
        this.jwtService = jwtService;
    }
    async login(dto) {
        const usuario = await this.usuarioRepo.findOne({ where: { usuario: dto.usuario } });
        if (!usuario) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        if (usuario.estado !== estados_usuarios_enum_1.EstadosUsuariosEnum.ACTIVO) {
            throw new common_1.UnauthorizedException('El usuario no se encuentra activo en el sistema');
        }
        const passwordMatch = await bcrypt.compare(dto.clave, usuario.clave);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const payload = { sub: usuario.id, usuario: usuario.usuario };
        const token = await this.jwtService.signAsync(payload);
        return { token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.UsuarioEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map