import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Formato } from './formato.schema';

@Injectable()
export class FormatoService {
    constructor (
        @InjectModel(Formato.name)
        private formatoModel: Model<Formato>
    ) {}

    async getAllFormatos(): Promise<Formato[]> {
        return this.formatoModel.find().exec();
    }

    async getFormatoById(id: string): Promise<Formato> {

        if (Types.ObjectId.isValid(id) === false) {
            throw new BadRequestException('ID inválido');
        }
        
        const formatoExistente = await this.formatoModel.findById(id).exec();

        if (!formatoExistente) {
            throw new NotFoundException('El formato no existe');
        }

        return formatoExistente;
    }

    async createFormato(formato: Formato) {
        return (await new this.formatoModel(formato).save())._id.toString();
    }
}
