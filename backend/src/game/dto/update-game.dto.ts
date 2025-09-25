import { PartialType } from '@nestjs/mapped-types';
import { CreateRoundScore } from './create-game.dto';

export class UpdateRoundScore extends PartialType(CreateRoundScore) {}
