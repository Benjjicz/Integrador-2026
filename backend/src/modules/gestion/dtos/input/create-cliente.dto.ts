import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateClienteDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombre!: string;

    @ApiProperty({ required: false, example: 'juan@empresa.com' })
    @IsEmail()
    @IsOptional()
    correo?: string;

    @ApiProperty({ required: false, example: '+54 11 1234-5678' })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    telefono?: string;

}