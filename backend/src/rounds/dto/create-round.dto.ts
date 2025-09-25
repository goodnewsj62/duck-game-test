import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateRoundDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  //   @IsDateString()
  //   @IsNotEmpty()
  //   endDate: string;
}
