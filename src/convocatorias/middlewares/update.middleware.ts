import mongoose, { CallbackWithoutResultAndOptionalError, Model, Error as MongooseError, Schema, UpdateQuery } from "mongoose";
import { UpdateConvocatoriaDTO } from "../dtos/UpdateConvocatoriasDTO";

export function registerUpdateValidators (schema: Schema) {
    schema.pre('updateOne', async function(next) {
        const update = this.getUpdate() as UpdateQuery<UpdateConvocatoriaDTO>;
        let fechaInicio = update.fechaInicio
        let fechaFin = update.fechaFin

        if (!fechaInicio || !fechaFin) {
            const id = this.getQuery()._id;
            const document = await this.model.findById(id).exec();
            fechaInicio ||= new Date(document.fechaInicio).toISOString();
            fechaFin ||= new Date(document.fechaFin).toISOString();
        }

        const fechaActual = new Date().toISOString();

        await Promise.all(Object.keys(update).map(async key => {
            switch (key) {
                case 'fechaInicio':
                    await validarEdicionDeFechas(update[key], fechaFin, next, 'fechaInicio');
                    break;
                case 'fechaFin':
                    await validarEdicionDeFechas(fechaInicio, update[key], next, 'fechaFin');
                    break;
                case 'formato':
                    await validarFormato(update[key], fechaInicio, fechaActual, next);
                    break;
                case 'archivo':
                    await validarArchivo(fechaInicio, fechaActual, next);
                    break;
                case 'proyectos':
                    await validarProyectos(update[key], fechaFin, next);
                    break;
            }
        }));
        
        next();
    },
    );
}

async function validarEdicionDeFechas(fechaInicio:string, fechaFin:string, next:CallbackWithoutResultAndOptionalError, campoAValidar: string) {
    if (fechaInicio > fechaFin) {
        const error = new MongooseError.ValidationError();
        error.addError(campoAValidar, new MongooseError.ValidatorError({
            message: `La fecha de inicio: ${fechaInicio} no puede ser mayor que la fecha de fin: ${fechaFin}`,
            path: campoAValidar,
            value: {fechaInicio, fechaFin}
        }));
        return next(error)
    }
}

async function validarFormato(formato: string, fechaInicio: string, fechaActual: string, next: CallbackWithoutResultAndOptionalError) {
    if (fechaActual > fechaInicio) {
        const error = new MongooseError.ValidationError();
        error.addError('formato', new MongooseError.ValidatorError({
            message: 'No puedes editar el formato después de la fecha de inicio',
            path: 'formato',
            value: formato
        }));
        return next(error)
    }
}

async function validarArchivo(fechaInicio: string, fechaActual: string, next: CallbackWithoutResultAndOptionalError) {
    if (fechaActual > fechaInicio) {
        const error = new MongooseError.ValidationError();
        error.addError('archivo', new MongooseError.ValidatorError({
            message: 'No puedes editar el archivo después de la fecha de inicio',
            path: 'archivo',
            value: fechaInicio
        }));
        return next(error);
    }
}

async function validarProyectos(proyectos: any, fechaFin: string, next: CallbackWithoutResultAndOptionalError) {
    if (new Date().toISOString() > fechaFin) {
      const error = new MongooseError.ValidationError();
      error.addError(
        "proyectos",
        new MongooseError.ValidatorError({
          message: "No puedes inscribir proyectos después de la fecha de fin",
          path: "proyectos",
          value: proyectos
        })
      );
      return next(error);
    }
  }