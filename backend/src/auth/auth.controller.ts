import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CurrentUser, IsPublic } from '@src/shared/decorators/user.decorator';
import type { Account } from 'generated/prisma';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @HttpCode(201)
  @Post('register')
  async create(@Body() createAuthDto: RegisterDto) {
    return await this.authService.register(createAuthDto);
  }

  @IsPublic()
  @Post('login')
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }

  @Get('account')
  async getAccount(@CurrentUser() user: Account) {
    return await this.authService.getAccount(user);
  }
}
