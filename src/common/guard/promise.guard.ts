import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PromiseGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    return req.user && req.user.role === 'admin';
  }
}
