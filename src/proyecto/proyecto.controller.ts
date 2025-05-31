    import { Body, Controller, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
    import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
    import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
    import { RolesGuard } from 'src/auth/guards/roles.guard';
    import { ProyectoService } from './proyecto.service';
    import { HasRoles } from 'src/auth/decorators/has-roles.decorator';
    import { ROLES } from 'src/constants/roles';
    import { Proyecto } from './proyecto.schema';
    import { CreateProyectoDTO } from './dtos/CreateProyectoDTO';

    @ApiTags('Proyecto')
    @ApiBearerAuth('access-token')
    @Controller('proyecto')
    @UseGuards(JwtAuthGuard, RolesGuard)
    export class ProyectoController {
        constructor(private proyectoService: ProyectoService) {}

        @Post(":idConvocatoria")
        @HasRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INVESTIGADOR)
        @ApiOperation({ summary: 'Crear un nuevo proyecto' })
        @ApiParam({ name: 'idConvocatoria', required: true, description: 'ID de la convocatoria asociada al proyecto' })
        @ApiBody({ type: CreateProyectoDTO })
        @ApiResponse({ status: 201, description: 'Proyecto creado exitosamente', type: Proyecto })
        @ApiBadRequestResponse({ description: 'ID de convocatoria inválido o datos del proyecto inválidos' })
        @ApiBadRequestResponse({ description: 'Error de validacion' })
        @ApiResponse({ status: 401, description: 'No autorizado' })
        @ApiResponse({ status: 404, description: 'Convocatoria no encontrada' })
        async createProyecto(
            @Param('idConvocatoria') idConvocatoria: string,
            @Body(new ValidationPipe({ transform: true })) proyecto: CreateProyectoDTO,
        ) {
            //console.log('Proyecto recibido:', JSON.stringify(proyecto, null, 2));
            return this.proyectoService.createProyecto(idConvocatoria, proyecto);
        }

        @Get()
        @HasRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INVESTIGADOR)
        @ApiOperation({ summary: 'Obtener todos los proyectos' })
        @ApiResponse({ status: 200, description: 'Lista de proyectos', type: [Proyecto] })
        @ApiResponse({ status: 401, description: 'No autorizado' })
        @ApiResponse({ status: 404, description: 'Proyectos no encontrados' })
        async getProyectos() {
            console.log(' GET /proyecto recibido');
            return this.proyectoService.getAllProyectos();
        }

        @Get(':id')
        @HasRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INVESTIGADOR)
        @ApiOperation({ summary: 'Obtener un proyecto por ID' })
        @ApiParam({ name: 'id', description: 'ID del proyecto' })
        @ApiResponse({ status: 200, description: 'Proyecto encontrado', type: Proyecto })
        @ApiResponse({ status: 400, description: 'ID inválido' })
        @ApiResponse({ status: 401, description: 'No autorizado' })
        @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
        async getProyecto(@Param('id') id: string) {
            return this.proyectoService.getProyectoById(id);
        }

    }
