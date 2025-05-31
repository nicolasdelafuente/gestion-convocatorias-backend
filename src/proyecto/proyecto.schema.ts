import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';
import { HydratedDocument, Mongoose } from 'mongoose';

export type ProyectoDocument = HydratedDocument<Proyecto>;

@Schema({ _id: false })  // Sin _id en cada gasto para evitar documentos anidados con ids propios
export class Gasto {
    @Prop({ required: true })
    @ApiProperty({ example: 'Equipamiento' })
    rubro: string;

    @Prop({ required: true })
    @ApiProperty({ example: 'Compra de computadoras' })
    descripcion: string;

    @Prop({ required: true })
    @ApiProperty({ example: 120000 })
    coste: number;
    }
    export const GastoSchema = SchemaFactory.createForClass(Gasto);

    @Schema()
    export class Presupuesto {
    @Prop({ type: [GastoSchema], default: [] })
    @ApiProperty({
        type: [Gasto],
        example: [{ rubro: 'Equipamiento', descripcion: 'Compra de computadoras', coste: 120000 }],
    })
    gastosCapital: Gasto[];

    @Prop({ type: [GastoSchema], default: [] })
    @ApiProperty({
        type: [Gasto],
        example: [{ rubro: 'Servicios', descripcion: 'Internet y luz', coste: 30000 }],
    })
    gastosCorrientes: Gasto[];
    }
    export const PresupuestoSchema = SchemaFactory.createForClass(Presupuesto);

    @Schema()
    export class Proyecto {
    @Prop({ required: true })
    @ApiProperty({
        description: 'ID del autor del proyecto',
        example: '67e5c338e4a7ddc1b25733ff',
        type: String,   
    })
    autor: string;

    @Prop({ required: true, type: [String], default: [] })
    @ApiProperty({
        description: 'Lista con emails invitados',
        example: ['invitado1@gmail.com', 'invitado2@gmail.com'],
        type: [String],
    })
    invitados: string[];

    @Prop({ type: Map, of:String , default: {} })
    camposExtra: {
        of: String,
        required: false,
        default: {},
    }

    @Prop({ type: PresupuestoSchema, required: true, default: () => ({ gastosCapital: [], gastosCorrientes: [] }) })
    @ApiProperty({
        description: 'Presupuesto del proyecto',
        type: Presupuesto,
    })
    presupuesto: Presupuesto;
}

export const ProyectoSchema = SchemaFactory.createForClass(Proyecto);

    /*
    @Prop({ required: true })
    @ApiProperty({
        description: 'Datos del proyecto',
        example: [
            {
            nombreDelCampo: 'Nombre del proyecto',
            dato: 'Proyecto de prueba'

            },
            {
            nombreDelCampo: 'Descripción del proyecto',
            dato: 'Descripción del proyecto de prueba'
            }
        ],
        type: [Object],
        required: true,
    })
    planDeTrabajo: [{
        nombreDelCampo: string,
        dato: string,
    }]
*/