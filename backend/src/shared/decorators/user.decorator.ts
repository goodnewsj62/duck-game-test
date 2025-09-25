import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Account } from 'generated/prisma';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): Account => {
    const req = context.switchToHttp().getRequest();

    return req.user;
  },
);

export const IS_PUBLIC_KEY = 'isPublic';
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
