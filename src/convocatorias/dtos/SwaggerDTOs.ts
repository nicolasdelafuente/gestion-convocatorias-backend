import { ApiProperty, ApiSchema, PartialType, PickType } from "@nestjs/swagger";
import { CreateConvocatoriaDto } from "./CreateConvocatoriaDTO";

@ApiSchema({ description: 'DTO utilizado exclusivamente para la documentación en Swagger. ' +
    'Permite representar correctamente un formulario multipart/form-data que incluye ' +
    'campos de texto de la convocatoria y un archivo adjunto. Este DTO no se utiliza en la lógica del controlador, ' +
    'ya que el controlador utiliza CreateConvocatoriaDto y Express.Multer.File para manejar la carga de archivos.' })
export class CreateConvocatoriaConPdfDTO extends CreateConvocatoriaDto {
    @ApiProperty({
        description: 'Archivo PDF de la convocatoria',
        type: 'string',
        format: 'binary',
        required: true,
        example: 'convocatoria.pdf',
    })
    archivo: Express.Multer.File;
}

@ApiSchema({ description: 'DTO utilizado exclusivamente para la documentación en Swagger. ' +
    'Permite representar correctamente un formulario multipart/form-data que incluye ' +
    'campos de texto de la convocatoria y un archivo adjunto. Este DTO no se utiliza en la lógica del controlador, ' +
    'ya que el controlador utiliza UpdateConvocatoriaDTO y Express.Multer.File para manejar la carga de archivos.' })
export class UpdateConvocatoriaConPdfDTO extends PartialType(CreateConvocatoriaConPdfDTO) {}