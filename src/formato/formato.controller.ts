import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FormatoService } from './formato.service';
import { Formato } from './formato.schema';
import { CreateFormatoDto } from './dtos/CreateFormatoDTO';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { HasRoles } from 'src/auth/decorators/has-roles.decorator';
import { ROLES } from 'src/constants/roles';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Formato')
@ApiBearerAuth('access-token')
@Controller('formato')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FormatoController {
    constructor(private formatoService: FormatoService) {}

    @Get()
    @HasRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
    @ApiOperation({ summary: 'Obtener todos los formatos' })
    @ApiResponse({ status: 200, description: 'Lista de formatos', type: [Formato] })
    @ApiResponse({ status: 400, description: 'Error al obtener los formatos' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 403, description: 'No tiene permisos para acceder a los formatos' })
    async get(): Promise<Formato[]> {
        return this.formatoService.getAllFormatos();
    }

    @Get(':id')
    @HasRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INVESTIGADOR)
    @ApiOperation({ summary: 'Obtener un formato por ID' })
    @ApiParam({ name: 'id', description: 'ID del formato a obtener' })
    @ApiResponse({ status: 200, description: 'Formato encontrado', type: Formato })
    @ApiResponse({ status: 400, description: 'ID inválido' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 403, description: 'No tiene permisos para acceder a los formatos' })
    @ApiResponse({ status: 404, description: 'Formato no encontrado' })
    async getFormatoById(@Param('id') id: string): Promise<Formato> {
        return this.formatoService.getFormatoById(id);
    }

    @Post()
    @HasRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
    @ApiOperation({ summary: 'Crear un nuevo formato' })
    @ApiBody({ type: CreateFormatoDto })
    @ApiResponse({ status: 201, description: 'Formato creado exitosamente' })
    @ApiResponse({ status: 400, description: 'Error al crear el formato' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 403, description: 'No tiene permisos para crear formatos' })
    async create (@Body() formato: CreateFormatoDto) {
        return this.formatoService.createFormato(formato)
    }
}
