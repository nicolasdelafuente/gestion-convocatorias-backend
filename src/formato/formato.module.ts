import { Module } from '@nestjs/common';
import { FormatoController } from './formato.controller';
import { FormatoService } from './formato.service';
import { Formato, FormatoSchema } from './formato.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [FormatoController],
  imports: [
    MongooseModule.forFeature([
        {
            name: Formato.name,
            schema: FormatoSchema,
        },
    ]),
    JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (ConfigService: ConfigService) => ({
            secret: ConfigService.get<string>("JWT_SECRET"),
            signOptions: { expiresIn: '60m'}
        })
    })
  ],
  providers: [FormatoService],
  exports: [FormatoService]
})
export class FormatoModule {}
