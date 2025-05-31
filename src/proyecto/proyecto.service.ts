import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Proyecto } from './proyecto.schema';
import { ConvocatoriasService } from 'src/convocatorias/convocatoria.service';
import { CreateProyectoDTO } from './dtos/CreateProyectoDTO';

@Injectable()
export class ProyectoService {
    constructor(
        @InjectModel(Proyecto.name)
        private proyectoModel: Model<Proyecto>,
        @InjectConnection()
        private readonly connection: Connection,
        private readonly convocatoriaService: ConvocatoriasService
    ) {}

    async createProyecto(idConvocatoria: string, nuevoProyecto: CreateProyectoDTO) {
        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            const proyecto = await this.proyectoModel.create([nuevoProyecto], { session });
            const proyectoCreado = proyecto[0];

            await this.convocatoriaService.updateConvocatoria(idConvocatoria, 
                {
                    proyectos:[proyectoCreado._id.toString()]
                },
                undefined,
                session
            );

            await session.commitTransaction();
            return proyectoCreado;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getAllProyectos() {
        return this.proyectoModel.find().exec();
    }

    async getProyectoById(id: string) {

        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('ID de proyecto inválido');
        }

        const proyecto = await this.proyectoModel.findById(id).exec();

        if (!proyecto) {
            throw new NotFoundException('Proyecto no encontrado');
        }

        return proyecto;
    }
}
