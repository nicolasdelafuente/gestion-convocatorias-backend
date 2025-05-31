import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConvocatoriasModule } from './convocatorias/convocatoria.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { FormatoModule } from './formato/formato.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { ProyectoModule } from './proyecto/proyecto.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    ConvocatoriasModule,
    UsuariosModule,
    FormatoModule,
    AutenticacionModule,
    ProyectoModule]
}

)
export class AppModule { }
