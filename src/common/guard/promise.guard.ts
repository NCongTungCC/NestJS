import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PromiseGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const RoleAuthorization = ['admin', 'manager'];
    const req = context.switchToHttp().getRequest();
    return req.user && RoleAuthorization.includes(req.user.role);
  }
}
