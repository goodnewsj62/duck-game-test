import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoundScore {
  @IsString()
  @IsNotEmpty()
  roundId: string;
}
