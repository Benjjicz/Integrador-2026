import { EstadosUsuariosEnum } from '../enums/estados-usuarios.enum';
export declare class UsuarioEntity {
    id: number;
    usuario: string;
    clave: string;
    estado: EstadosUsuariosEnum;
}
