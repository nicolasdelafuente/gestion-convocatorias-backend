import { Controller, Post, Body, Get, Param, Put, ValidationPipe, Delete, UseInterceptors, UploadedFile, Patch, UseGuards, Res, StreamableFile, Header, NotFoundException } from '@nestjs/common';
import { ConvocatoriasService } from './convocatoria.service';
import { Convocatoria } from './convocatoria.schema';
import { UpdateConvocatoriaDTO } from './dtos/UpdateConvocatoriasDTO';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateConvocatoriaDto } from './dtos/CreateConvocatoriaDTO';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ROLES } from '../constants/roles';
import { HasRoles } from '../auth/decorators/has-roles.decorator';

import { ApiOperation, ApiTags, ApiBody, ApiResponse, ApiBearerAuth, ApiConsumes, ApiExtraModels, ApiParam, ApiBadRequestResponse } from '@nestjs/swagger';
import { CreateConvocatoriaConPdfDTO, UpdateConvocatoriaConPdfDTO } from './dtos/SwaggerDTOs';

@ApiTags('Convocatorias')
@ApiBearerAuth('access-token')
@ApiExtraModels(CreateConvocatoriaDto, UpdateConvocatoriaDTO)
@Controller('convocatoria')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConvocatoriasController {
    constructor(private convocatoriasService: ConvocatoriasService) { }

    @Get()
    @HasRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INVESTIGADOR)
    @ApiOperation({ summary: 'Obtener todas las convocatorias' })
    @ApiResponse({ status: 200, description: 'Lista de convocatorias', type: [Convocatoria] })
    @ApiResponse({ 
        status: 400, 
        description: 'Datos inválidos' 
    })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async get(): Promise<Convocatoria[]> {
        return this.convocatoriasService.get();
    }

    @Get(':id')
    @HasRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INVESTIGADOR)
    @ApiOperation({ summary: 'Obtener una convocatoria por ID' })
    @ApiParam({ name: 'id', description: 'ID de la convocatoria' })
    @ApiResponse({ status: 200, description: 'Convocatoria encontrada', type: Convocatoria })
    @ApiResponse({ status: 400, description: 'ID inválido' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Convocatoria no encontrada' })
    async getConvocatoria(@Param('id') id: string): Promise<Convocatoria> {
        return this.convocatoriasService.getConvocatoria(id);
    }

    @Get("archivo/:id")
    @HasRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INVESTIGADOR)
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'inline; filename="documento.pdf"')
    @ApiOperation({ summary: 'Obtener el archivo de una convocatoria por ID' })
    @ApiParam({ name: 'id', description: 'ID de la convocatoria' })
    @ApiResponse({ status: 200, description: 'Archivo encontrado' })
    @ApiResponse({ status: 400, description: 'ID inválido' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
    async getArchivo(@Param('id') id: string): Promise<StreamableFile> {
        const archivo = await this.convocatoriasService.getArchivoDeConvocatoria(id);

        return new StreamableFile(archivo.contenido, {
            type:archivo.tipo,
            disposition: `inline; filename="${archivo.nombre}"`
        });
    }

    @Post()
    @HasRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
    @UseInterceptors(FileInterceptor('archivo'))
    @ApiOperation({ 
        summary: 'Crear una nueva convocatoria',
        description:
        'Este endpoint requiere multipart/form-data con campos de texto + archivo. En Swagger UI, es posible que al probarlo falle porque Nest separa @Body y @UploadedFile. Use Postman o tu cliente HTTP para pruebas reales.'
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Datos de la convocatoria y archivo adjunto',
        type: CreateConvocatoriaConPdfDTO
    })
    @ApiResponse({ status: 201, description: 'Convocatoria creada', type: Convocatoria })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 403, description: 'No tienes permiso para crear una convocatoria' })
    async create(
        @Body() CreateConvocatoriaDto: CreateConvocatoriaDto,
        @UploadedFile() archivo: Express.Multer.File
    ) {
        return this.convocatoriasService.create(CreateConvocatoriaDto, archivo);
    }

    @Put(':id')
    @HasRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
    @UseInterceptors(FileInterceptor('archivo'))
    @ApiOperation({ summary: 'Actualizar una convocatoria por ID',
        description:
        'Este endpoint requiere multipart/form-data con campos de texto + archivo. En Swagger UI, es posible que al probarlo falle porque Nest separa @Body y @UploadedFile. Use Postman o tu cliente HTTP para pruebas reales.'
     })
    @ApiParam({ name: 'id', description: 'ID de la convocatoria' })
    @ApiResponse({ status: 200, description: 'Convocatoria actualizada'})
    @ApiBadRequestResponse({ description: 'ID inválido' })
    @ApiBadRequestResponse({ description: 'Formato inválido' })
    @ApiBadRequestResponse({ description: 'Error de validaciones' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 403, description: 'No tienes permiso para actualizar esta convocatoria' })
    @ApiResponse({ status: 404, description: 'Convocatoria no encontrada' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Datos de la convocatoria y archivo adjunto',
        type: UpdateConvocatoriaConPdfDTO
    })
    async updateConvocatoria(
        @Param('id') id: string,
        @Body(new ValidationPipe()) edicionDeConvocatoria: UpdateConvocatoriaDTO,
        @UploadedFile() archivo?: Express.Multer.File
    ) {
        return this.convocatoriasService.updateConvocatoria(id, edicionDeConvocatoria, archivo);
    }

    @Delete(':id')
    @HasRoles(ROLES.SUPER_ADMIN)
    @ApiOperation({ summary: 'Eliminar una convocatoria por ID' })
    @ApiResponse({ status: 200, description: 'Convocatoria eliminada' })
    @ApiResponse({ status: 400, description: 'ID inválido' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 403, description: 'No tienes permiso para eliminar esta convocatoria' })
    @ApiResponse({ status: 404, description: 'Convocatoria no encontrada' })
    async eliminarConvocatoria(@Param('id') id: string) {
        return this.convocatoriasService.eliminarConvocatoria(id);
    }
}
