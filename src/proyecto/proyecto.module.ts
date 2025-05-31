import { Module } from '@nestjs/common';
import { ProyectoController } from './proyecto.controller';
import { ProyectoService } from './proyecto.service';
import { Mongoose } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Proyecto, ProyectoSchema } from './proyecto.schema';
import { ConvocatoriasService } from 'src/convocatorias/convocatoria.service';
import { ConvocatoriasModule } from 'src/convocatorias/convocatoria.module';

@Module({
  controllers: [ProyectoController],
  imports: [
    MongooseModule.forFeature([
        {
            name: Proyecto.name,
            schema: ProyectoSchema,
        },
    ]),
    JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (ConfigService: ConfigService) => ({
            secret: ConfigService.get<string>("JWT_SECRET"),
            signOptions: { expiresIn: '60m' }
        })
    }),
    ConvocatoriasModule
  ],
  providers: [ProyectoService]
})
export class ProyectoModule {}
