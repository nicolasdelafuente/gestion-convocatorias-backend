import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type FormatoDocument = HydratedDocument<Formato>;

@Schema()
@ApiSchema({ name: 'Formato' })
export class Formato {

    @ApiProperty({ 
        description: 'ID del formato', 
        type: String,
        example: '60d5f484f1a2c8b8f8e4b8c8',
        required: true,
    })
    @Prop({ required: true })
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
    @Prop(raw([{
        nombreDelCampo: { type: String, required: true },
        tipo: { type: String, enum: ['texto', 'selector'], required: true },
        maxNumeroDeCaracteres: { type: Number },
        opciones: { type: [String] }
    }]))
    campos: Array<{
        nombreDelCampo: string;
        tipo: 'texto' | 'selector';
        maxNumeroDeCaracteres?: number;
        opciones?: string[];
    }>;

}

export const FormatoSchema = SchemaFactory.createForClass(Formato);
