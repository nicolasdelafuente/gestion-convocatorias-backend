import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { Formato, FormatoSchema } from 'src/formato/formato.schema';

export type ConvocatoriasDocument = HydratedDocument<Convocatoria>;

@Schema()
@ApiSchema({ description: 'Schema que define la estructura de los documentos de la coleccion "Convocatorias"' })
export class Convocatoria {
  @Prop({required: true})
  @ApiProperty({
    description: 'Título de la convocatoria', 
    example: 'Convocatoria de prueba',
    type: String,
    required: true
  })
  titulo: string;

  @Prop({required: true})
  @ApiProperty({
    description: 'Descripción de la convocatoria', 
    example: 'Convocatoria de prueba',
    type: String,
    required: true
  })
  descripcion: string;

  @Prop({required: true})
  @ApiProperty({
    description: 'Fecha de inicio de la convocatoria', 
    example: '2025-05-16T14:00:00.000Z',
    type: Date,
    required: true
  })
  fechaInicio: Date;

  @Prop({required: true})
  @ApiProperty({
    description: 'Fecha de fin de la convocatoria', 
    example: '2025-05-16T18:00:00.000Z',
    type: Date,
    required: true
  })
  fechaFin: Date;

  //Si da error intentar solo @Prop(FormatoSchema)
  @Prop(FormatoSchema)
  @ApiProperty({
    description: 'Identificador del formato de la convocatoria', 
    example: '67e5c338e4a7ddc1b25733ff',
    type: Formato,
    required: true
  })
  formato: Formato

  @Prop({
    type: {
        nombre: String,
        tipo: String,
        contenido: Buffer,
    },
    required: true
  })
  @ApiProperty({
    description: 'Archivo de la convocatoria', 
    example: {
      nombre: 'convocatoria.pdf',
      tipo: 'application/pdf',
      contenido: Buffer.from('...')
    },
    type: Object,
    required: true
  })
  archivo: { nombre: string; tipo: string; contenido: Buffer };

  @Prop()
  @ApiProperty({
    description: 'Lista de proyectos inscriptos a la convocatoria', 
    example: ['67e5c338e4a7ddc1b25733ff', '67e5c338e4a7ddc1b25733fg'],
    type: [String],
    required: false,
    default: []
  })
  proyectos: string[];

  @Prop({default: false, type: Boolean})
  @ApiProperty({
    description: "Estado de la convocatoria",
    example: 'true/false',
    type: Boolean,
    required: false
})
  baja: Boolean
}

export const ConvocatoriaSchema = SchemaFactory.createForClass(Convocatoria);

export type ConvocatoriaDocumentOverride = {
    name: Types.Subdocument<Types.ObjectId> & Formato;
};

export type ConvocatoriaDocument = HydratedDocument<Convocatoria, ConvocatoriaDocumentOverride>