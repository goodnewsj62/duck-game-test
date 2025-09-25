import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@src/prisma/prisma.service';
import { Request } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import * as url from 'url';
import { IS_PUBLIC_KEY } from '../decorators/user.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    if (context.getType() === 'ws') {
      return this.handleWsAuth(context);
    }

    return this.handleHttpAuth(context);
  }

  private async handleHttpAuth(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request?.headers?.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const bearerToken = this.extractTokenFromHeader(authHeader);
    if (!bearerToken) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    try {
      (request as any).user = await this.validateToken(bearerToken);
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async handleWsAuth(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<AuthenticatedWebSocket>();
    const data = context.switchToWs().getData();

    let token: string | undefined;

    if (client.url) {
      const query = url.parse(client.url, true).query;
      token = query.token as string;
    }

    if (!token && data?.token) {
      token = data.token;
    }

    if (!token) {
      this.sendWsError(
        client,
        'Authentication required. Please provide a valid token.',
      );
      return false;
    }

    try {
      client.user = await this.validateToken(token);
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        this.sendWsError(client, 'Token expired');
      } else {
        this.sendWsError(client, 'Invalid or expired token');
      }
      return false;
    }
  }

  private extractTokenFromHeader(authHeader: string): string | undefined {
    const [type, token] = authHeader.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async validateToken(bearerToken: string) {
    const payload = await this.jwtService.verifyAsync(bearerToken, {
      secret: this.configService.get('jwt.secret'),
    });

    const user = await this.prisma.account.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token provided');
    }

    return user;
  }

  private sendWsError(client: AuthenticatedWebSocket, message: string) {
    client.send(JSON.stringify({ event: 'error', data: { message } }));
    client.close(1008, message);
  }
}
