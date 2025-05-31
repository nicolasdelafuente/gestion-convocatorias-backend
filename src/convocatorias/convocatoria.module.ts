import { Module } from '@nestjs/common';
import { ConvocatoriasController } from './convocatoria.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Convocatoria, ConvocatoriaSchema } from './convocatoria.schema';
import { ConvocatoriasService } from './convocatoria.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { registerUpdateValidators } from './middlewares/update.middleware';
import { FormatoModule } from 'src/formato/formato.module';

@Module({
  controllers: [ConvocatoriasController],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Convocatoria.name,
        useFactory: () => {
            const schema = ConvocatoriaSchema;
            registerUpdateValidators(schema);
            return schema;
        }

      },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '60m' },
      }),
  }),
  FormatoModule
  ],
  providers: [ConvocatoriasService],
  exports: [ConvocatoriasService]
})
export class ConvocatoriasModule {}