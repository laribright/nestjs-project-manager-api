import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';

import { AuthService } from '../auth/auth.service';
import { TaskCreatedEvent } from '../tasks/task-created.event';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8000',
  },
})
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server!: Server;

  constructor(private readonly authService: AuthService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token as string;

      if (typeof token !== 'string') {
        throw new Error('Missing token');
      }

      const payload: { sub: string; exp?: number } =
        await this.authService.verifyAccessToken(token);

      const id = Number(payload.sub);

      const expiresAt = (payload.exp ?? 0) * 1000; // in milliseconds

      if (
        !Number.isInteger(id) ||
        id < 1 ||
        !Number.isFinite(expiresAt) ||
        expiresAt < Date.now()
      ) {
        throw new Error('Invalid token');
      }

      const user = await this.authService.findSafeUser(id);

      if (!user) {
        throw new Error('Account not found');
      }

      await client.join(`user:${user.id}`);

      if (!client.connected) {
        return;
      }

      client.data.expiryTimer = setTimeout(
        () => client.disconnect(true),
        expiresAt - Date.now(),
      );

      client.emit('ready', { userId: user.id });
    } catch {
      client.emit('auth_error', 'Connection rejected');
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    clearTimeout(client.data.expiryTimer);
  }

  @OnEvent('task.created')
  taskCreated(event: TaskCreatedEvent) {
    this.server
      .to(`user:${event.ownerId}`)
      .emit('task.created', { taskId: event.taskId });
  }
}
