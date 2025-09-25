import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@src/prisma/prisma.service';
import { Account, Role } from 'generated/prisma';
import bcrypt from 'node_modules/bcryptjs';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async register(data: RegisterDto): Promise<Account> {
    let user = await this.prisma.account.findUnique({
      where: { username: data.username },
    });

    if (user) {
      throw new HttpException('user with username already exists', 400);
    }
    const nikitaUsername =
      this.configService.get('NIKITA_USERNAME') || 'Никита';
    const role =
      data.username === Role.ADMIN.toLocaleLowerCase()
        ? Role.ADMIN
        : data.username === nikitaUsername
          ? Role.NIKITA
          : Role.SURVIVOR;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    user = await this.prisma.account.create({
      data: {
        username: data.username,
        role,
        password: hashedPassword,
        timezone: data.timezone,
      },
    });

    return user;
  }

  async login(data: LoginDto) {
    const user = await this.prisma.account.findUnique({
      where: { username: data.username },
    });

    if (!user) {
      throw new HttpException('user not found', 404);
    }

    const access_token = await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: this.configService.get('jwt.secret'),
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...others } = user;

    return {
      access_token,
      user: others,
    };
  }

  getAccount(user: Account) {
    const resp: any = { ...user };
    delete resp['password'];
    return resp;
  }
}
