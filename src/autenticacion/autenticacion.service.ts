import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario, UsuarioDocument } from '../usuarios/usuarios.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AutenticacionService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const usuario = await this.usuarioModel.findOne({ email });

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Contraseña incorrecta.');
    }

    const payload = {
      sub: usuario._id,
      email: usuario.email,
      nombre: usuario.nombre,
      roles: usuario.roles,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: 'jwt_secret_refresh',
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
      usuario: this.sacarContrasenia(usuario),
      message: 'Login exitoso',
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const usuario = this.jwtService.verify(refreshToken, {
        secret: 'jwt_secret_refresh',
      });

      const payload = {
        sub: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre,
      };

      const access_token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
      });

      const refresh_token = await this.jwtService.signAsync(payload, {
        secret: 'jwt_secret_refresh',
        expiresIn: '7d',
      });

      return {
        access_token,
        refresh_token,
        status: 200,
        message: 'Refresh token exitoso',
      };
    } catch (error) {
      throw new HttpException('Falló el refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  private sacarContrasenia(usuario: UsuarioDocument) {
    const { password, ...rest } = usuario.toObject();
    return rest;
  }
}
