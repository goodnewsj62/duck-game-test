import { UseGuards } from '@nestjs/common';
import * as WebSocket from '@nestjs/platform-ws';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { AuthGuard } from '@src/shared/guards/auth.guard';
import { CreateRoundScore } from './dto/create-game.dto';
import { GameService } from './game.service';

interface AuthenticatedWebSocket extends WebSocket {
  user?: { id: string; username: string };
  roundId?: string;
}

@WebSocketGateway({})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private clients = new Map<string, AuthenticatedWebSocket>();

  constructor(private readonly gameService: GameService) {}

  handleConnection() {
    // handleConnection(_client: AuthenticatedWebSocket) {
    // if (!client.user) {
    //   client.send(
    //     JSON.stringify({
    //       event: 'error',
    //       data: { message: 'Unauthorized connection' },
    //     }),
    //   );
    //   client.close(1008, 'Unauthorized');
    //   return;
    // }
    console.log(`User connected`);
  }

  handleDisconnect(client: AuthenticatedWebSocket) {
    const username = client.user?.username || 'Unknown';
    console.log(`Game client disconnected: ${username}`);

    // Remove client from tracking
    for (const [key, trackedClient] of this.clients.entries()) {
      if (trackedClient === client) {
        this.clients.delete(key);
        break;
      }
    }
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('tap')
  async handleTap(
    @MessageBody() data: CreateRoundScore,
    @ConnectedSocket() client: AuthenticatedWebSocket,
  ): Promise<void> {
    if (!client.user) {
      this.sendUnAuthenticatedMessage(client);
      return;
    }

    const { roundId } = data;

    if (!roundId) {
      client.send(
        JSON.stringify({
          event: 'error',
          data: { message: 'roundId is required' },
        }),
      );
      return;
    }

    // Update score using authenticated user's ID
    try {
      const scoreResponse = await this.gameService.tap(data, client.user.id);
      client.send(
        JSON.stringify({
          event: 'score-updated',
          data: scoreResponse,
        }),
      );
    } catch {
      client.send(
        JSON.stringify({
          event: 'error',
          data: {
            message:
              'Failed to update score. Round may not exist or be inactive.',
          },
        }),
      );
    }
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('get-score')
  async handleGetScore(
    @MessageBody() data: { roundId: string },
    @ConnectedSocket() client: AuthenticatedWebSocket,
  ): Promise<void> {
    if (!client.user) {
      this.sendUnAuthenticatedMessage(client);
      return;
    }

    const { roundId } = data;
    try {
      const resp = await this.gameService.getRoundScore(
        roundId,
        client.user.id,
      );

      client.send(
        JSON.stringify({
          event: 'round-score',
          data: resp,
        }),
      );
    } catch {
      client.send(
        JSON.stringify({
          event: 'error',
          data: { message: 'Round not found or unauthorized' },
        }),
      );
    }
  }

  private sendUnAuthenticatedMessage(client: AuthenticatedWebSocket) {
    client.send(
      JSON.stringify({
        event: 'error',
        data: { message: 'Not authenticated' },
      }),
    );
  }
}
