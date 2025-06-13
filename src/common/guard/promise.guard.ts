import { CanActivate, ExecutionContext } from '@nestjs/common';
export class PromiseGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    return req.user && req.user.role === 'admin';
  }
}
