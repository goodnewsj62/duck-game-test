import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '@src/shared/decorators/user.decorator';
import type { Account } from 'generated/prisma';
import { CreateRoundDto } from './dto/create-round.dto';
import { RoundsService } from './rounds.service';

@Controller('rounds')
export class RoundsController {
  constructor(private readonly roundsService: RoundsService) {}

  @Post()
  async create(
    @Body() createRoundDto: CreateRoundDto,
    @CurrentUser() currentUser: Account,
  ) {
    const userId: string = currentUser.id;
    return await this.roundsService.create(createRoundDto, userId);
  }

  @Get()
  async findAll() {
    return this.roundsService.findAll();
  }
  @Get('/valid')
  async validRound(@CurrentUser() user: Account) {
    return this.roundsService.validRounds(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.roundsService.findOne(id);
  }
}
