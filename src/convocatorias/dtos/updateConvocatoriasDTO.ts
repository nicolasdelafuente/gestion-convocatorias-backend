import { ApiProperty, ApiSchema, PartialType } from "@nestjs/swagger";
import { IsOptional, IsArray, IsString, IsNotEmpty } from "class-validator";
import { CreateConvocatoriaDto } from "./CreateConvocatoriaDTO";

@ApiSchema({ description: 'DTO para actualizar una convocatoria' })
export class UpdateConvocatoriaDTO extends PartialType(CreateConvocatoriaDto) {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    @ApiProperty({
        description: 'Lista de IDs de proyectos inscriptos a la convocatoria',
        example: ['67f033d114e513d90e3cb48d', '67f033d114e513d90e3cb48e'],
        type: [String],
        required: false,
    })
    proyectos?: string[];
}