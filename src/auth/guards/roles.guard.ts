import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasRole = requiredRoles.some((role) => user?.roles?.includes(role));
        
    if (!hasRole) {
        throw new ForbiddenException({
            success: false,
            message: 'No tienes los permisos necesarios para acceder a este recurso',
            // rolesRequeridos: requiredRoles,
            // tusRoles: user?.roles || []
        });
    }

    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}