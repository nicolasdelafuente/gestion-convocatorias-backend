import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ description: 'DTO para crear una nueva convocatoria' })
export class CreateConvocatoriaDto {
  @ApiProperty({ 
    description: 'Título de la convocatoria', 
    example: 'Convocatoria de prueba' 
  })
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @ApiProperty({ 
    description: 'Descripción de la convocatoria', 
    example: 'Convocatoria de prueba' 
  })
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @ApiProperty({ 
    description: 'Fecha de inicio de la convocatoria', 
    example: '2024-01-01', 
    type: Date
  })
  @IsNotEmpty()
  fechaInicio: Date;

  @ApiProperty({ 
    description: 'Fecha de fin de la convocatoria', 
    example: '2024-01-01',
    type: Date
  })
  @IsNotEmpty()
  fechaFin: Date;

  @ApiProperty({ 
    description: 'Identificador del formato de la convocatoria', 
    example: '67f033d114e513d90e3cb48d' 
  })
  @IsNotEmpty()
  @IsString()
  formato: string;
}
