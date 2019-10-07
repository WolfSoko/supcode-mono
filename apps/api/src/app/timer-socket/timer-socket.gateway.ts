import {Controller} from '@nestjs/common';
import {OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse} from '@nestjs/websockets';
import {TimerMessage} from '@supcode-mono/api-interfaces';
import {from, Observable, of} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';
import {Client, Server} from 'socket.io';
import {AppService} from '../app.service';
import {TimerSocketService} from './timer-socket.service';


@WebSocketGateway()
export class TimerSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly timerService: TimerSocketService) {
  }

  @WebSocketServer( ) server: Server;

  views = 0;

  async handleConnection() {
    this.views++;
    this.server.emit('views', this.views);
  }

  async handleDisconnect() {
    this.views--;
    this.server.emit('views', this.views);
  }


  @SubscribeMessage('timer')
  handleTimer(client: Client, data: unknown): Observable<WsResponse<TimerMessage>> {
    return this.timerService.getTime$().pipe(
      map(time => ({time})),
      concatMap(timerMessage => of({event: 'time', data: timerMessage}))
    );
  }

}
