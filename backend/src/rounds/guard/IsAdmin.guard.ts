import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Role } from 'generated/prisma';
import { Observable } from 'rxjs';

export class IsAdmin implements CanActivate {
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request?.user?.role === Role.ADMIN) return true;

    return false;
  }
}
