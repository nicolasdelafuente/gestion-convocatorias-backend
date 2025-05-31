import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsEnum, IsNumber } from 'class-validator';

class CampoTextoDto {
    @IsString()
    nombreDelCampo: string;

    @IsEnum(['texto'])
    tipo: 'texto';

    @IsNumber()
    maxNumeroDeCaracteres: number;
}

class CampoDesplegableDto {
    @IsString()
    nombreDelCampo: string;

    @IsEnum(['selector'])
    tipo: 'selector';

    @IsArray()
    opciones: string[];
}

@ApiSchema({ description: 'DTO para crear un nuevo formato' })
export class CreateFormatoDto {
    @ApiProperty({
        description: 'Nombre del formato',
        type: String,
        example: 'Formato de ejemplo',
        required: true,
    })
    @IsString()
    nombreDelFormato: string;

    @ApiProperty({
        description: 'Campos del formato',
        type: [Object],
        example: [
            {
                nombreDelCampo: 'Nombre',
                tipo: 'texto',
                maxNumeroDeCaracteres: 50,
            },
            {
                nombreDelCampo: 'Categorias',
                tipo: 'selector',
                opciones: ['Categoria 1', 'Categoria 2'],
            }
        ],
        required: true,
    })
    @IsArray()
    campos: (CampoTextoDto | CampoDesplegableDto)[];
}
