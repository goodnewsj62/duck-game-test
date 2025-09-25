import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@src/prisma/prisma.service';
import { addSeconds } from 'date-fns';
import { Role } from 'generated/prisma';
import { CreateRoundScore } from './dto/create-game.dto';

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async tap(data: CreateRoundScore, userId: string) {
    //  if role ===  nikita leave out

    const round = await this.prisma.round.findUnique({
      where: { id: data.roundId },
    });
    const now = new Date();

    if (!round) throw new Error('Round does not exists');

    const coolDownSeconds: number =
      this.configService.get('coolDownDuration') ?? 0;
    if (
      now < addSeconds(round.startDate, coolDownSeconds) ||
      now > round.endDate
    ) {
      throw new Error('invalid tap period');
    }

    const user = await this.prisma.account.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error('User not found');

    return await this.prisma.$transaction(async (trx) => {
      let roundScore = await trx.roundScore.findUnique({
        where: {
          roundId_userId: {
            roundId: data.roundId,
            userId,
          },
        },
      });

      const isNikita = user.role === Role.NIKITA;

      if (!roundScore) {
        const { taps, score } = isNikita
          ? { taps: 0, score: 0 }
          : { taps: 1, score: 1 };

        roundScore = await trx.roundScore.create({
          data: {
            userId,
            roundId: data.roundId,
            taps,
            score,
          },
        });

        return roundScore;
      }

      if (isNikita) {
        return roundScore;
      }

      const newTaps = roundScore.taps + 1;
      const extra = newTaps % 11 === 0 ? 10 : 1;

      return await trx.roundScore.update({
        where: { id: roundScore.id },
        data: {
          taps: { increment: 1 },
          score: { increment: extra },
        },
      });
    });
  }

  async getRoundScore(roundId: string, userId: string) {
    const round = await this.prisma.round.findUnique({
      where: { id: roundId },
    });

    if (!round) throw new Error('Round does not exists');

    const roundScore = await this.prisma.roundScore.findUnique({
      where: {
        roundId_userId: {
          roundId,
          userId,
        },
      },
    });

    const higestRated = await this.prisma.roundScore.findMany({
      where: {
        roundId,
      },
      orderBy: {
        score: 'desc',
      },
      include: {
        user: true,
      },
    });

    const sum = await this.prisma.roundScore.aggregate({
      where: { roundId },
      _sum: { score: true },
    });

    const totalScore = sum._sum.score ?? 0;

    return {
      totalScore,
      score: roundScore?.score ?? 0,
      taps: roundScore?.taps ?? 0,
      higestest: higestRated?.[0]?.score ?? 0,
      username: higestRated?.[0]?.user?.username ?? 'none',
    };
  }
}
