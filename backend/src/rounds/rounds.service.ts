// rounds.service.ts
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@src/prisma/prisma.service';
import { addSeconds } from 'date-fns';
import { Round } from 'generated/prisma';
import { CreateRoundDto } from './dto/create-round.dto';

@Injectable()
export class RoundsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(data: CreateRoundDto, userId: string): Promise<Round> {
    const startDate = new Date(data.startDate);
    const endDate = addSeconds(
      startDate,
      this.configService.get<number>('ROUND_DURATION') ?? 0,
    );

    const resp = await this.prisma.round.create({
      data: {
        startDate,
        endDate,
        creatorId: userId,
      },
    });

    return this.applyDuration(resp);
  }

  async findAll() {
    const values = await this.prisma.round.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return values.map((v) => this.applyDuration(v));
  }
  async validRounds(userId: string) {
    const now = new Date();
    const values = await this.prisma.round.findMany({
      where: {
        OR: [
          {
            endDate: {
              gte: now,
            },
          },
          {
            roundScores: {
              some: {
                userId: {
                  equals: userId,
                },
              },
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return values.map((v) => this.applyDuration(v));
  }

  async findOne(id: string) {
    const data = await this.prisma.round.findUnique({ where: { id } });
    if (!data) throw new HttpException('Round not found', 404);

    return this.applyDuration(data);
  }

  private applyDuration(data: Round) {
    const coolingDuration = this.configService.get('coolDownDuration') || 0;
    const roundDuration = this.configService.get('roundDuration') || 0;

    return {
      ...data,
      coolingDuration,
      roundDuration,
    };
  }
}
