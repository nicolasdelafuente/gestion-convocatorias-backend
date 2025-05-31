import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Convocatoria } from './convocatoria.schema';
import { ClientSession, Model, Error as MongooseError } from 'mongoose';
import { ObjectId } from 'mongoose';
import { Types } from 'mongoose';
import { UpdateConvocatoriaDTO } from './dtos/UpdateConvocatoriasDTO';
import { CreateConvocatoriaDto } from './dtos/CreateConvocatoriaDTO';
import { FormatoService } from 'src/formato/formato.service';

@Injectable()
export class ConvocatoriasService {
  constructor(
    @InjectModel(Convocatoria.name) private convoctariasModel: Model<Convocatoria>,
    private readonly formatoService: FormatoService
  ) {}

  async get(): Promise<Convocatoria[]> {
    return this.convoctariasModel.find().select("-archivo").exec();
  }

  async getConvocatoria(id: string): Promise<Convocatoria> {
    
    if (Types.ObjectId.isValid(id) === false) {
      throw new BadRequestException('El ID de la convocatoria no es válido');
    }

    const convocatoriaExistente = await this.convoctariasModel
      .findById(id)
      .select("-archivo")
      .exec();

    if (!convocatoriaExistente) {
      throw new NotFoundException('La convocatoria no existe');
    }

    return convocatoriaExistente;
  }

  async create(CreateConvocatoriaDto: CreateConvocatoriaDto, archivo: Express.Multer.File) {
    const nuevaConvocatoria = new this.convoctariasModel({
        ...CreateConvocatoriaDto,
        archivo: {
            nombre: archivo.originalname,
            tipo: archivo.mimetype,
            contenido: archivo.buffer,
        },
        proyectos: [],
        baja: false
    });
    return nuevaConvocatoria.save();
  }

  async updateConvocatoria(id: string, convocatoria: UpdateConvocatoriaDTO, archivo?: Express.Multer.File, session?: ClientSession) {

    if (Types.ObjectId.isValid(id) === false) {
        throw new BadRequestException('El ID de la convocatoria no es válido');
    }

    const convocatoriaActual = await this.convoctariasModel.findById(id).session(session).exec();
    
    if (!convocatoriaActual) {
        throw new NotFoundException(
          'La convocatoria que desea actualizar no existe',
        );
      }
    
    if (convocatoria.formato) {
        let formato = await this.formatoService.getFormatoById(convocatoria.formato)
        if (!formato) {
            throw new BadRequestException (
                "El formato que desea utilizar no existe"
            )
        }
    }
    
    const edicionDeConvocatoria: UpdateConvocatoriaDTO & { archivo?: {
        nombre: string;
        tipo: string;
        contenido: Buffer;
    }} = {
        ...convocatoria,
    }
    
    if (archivo) {
        edicionDeConvocatoria.archivo = {
            nombre: archivo.originalname,
            tipo: archivo.mimetype,
            contenido: archivo.buffer,
        }
    }

    if (Array.isArray(convocatoria.proyectos)) {
        edicionDeConvocatoria.proyectos = [...convocatoriaActual.proyectos, ...convocatoria.proyectos]
    }

    try {
        await convocatoriaActual.updateOne(edicionDeConvocatoria, session ? { session } : {}).exec()
        return { message: "Convocatoria actualizada exitosamente" }
    } catch (error) {
        if (error.name === 'ValidationError') {
            throw new BadRequestException(
                Object.values(error.errors).map((e: any) => e.message).join(', ')
            );
        }
        throw new InternalServerErrorException('Error inesperado al actualizar');
    }
  }

  async eliminarConvocatoria(_id: string) {

    if (Types.ObjectId.isValid(_id) === false) {
      throw new BadRequestException('El ID de la convocatoria no es válido');
    }

    const convocatoriaExistente = await this.convoctariasModel
      .findByIdAndUpdate(_id, {baja: true}, {new: true})
      .select("-archivo")
      .exec();

    if (!convocatoriaExistente) {
      throw new NotFoundException('NO EXISTE');
    }

    return convocatoriaExistente
  }

  async getArchivoDeConvocatoria(id: string) {

    if (Types.ObjectId.isValid(id) === false) {
      throw new BadRequestException('El ID de la convocatoria no es válido');
    }

    const convocatoria = await this.convoctariasModel.findById(id).select("archivo").exec()

    if (!convocatoria) {
        throw new NotFoundException("La convocatoria no existe")
    }

    return convocatoria.archivo
  }
}
