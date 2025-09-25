import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoundsModule } from './rounds/rounds.module';
import configuration from './shared/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    PrismaModule,
    AuthModule,
    RoundsModule,
    GameModule,
  ],
})
export class AppModule {}
