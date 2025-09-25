import { Controller, Get, Param } from '@nestjs/common';
import { CurrentUser } from '@src/shared/decorators/user.decorator';
import type { Account } from 'generated/prisma';
import { GameService } from './game.service';

@Controller('round-score')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: Account) {
    return this.gameService.getRoundScore(id, user.id);
  }
}
