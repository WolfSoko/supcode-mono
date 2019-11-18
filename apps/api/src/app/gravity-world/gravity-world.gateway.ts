import {OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse} from '@nestjs/websockets';
import {GravityBall, GravityWorldOptionsMessage, NextStepMessage} from '@supcode-mono/api-interfaces';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {concatMap, map, tap} from 'rxjs/operators';
import {Client, Server} from 'socket.io';
import {GravityWorldService} from './gravity-world.service';


@WebSocketGateway()
export class GravityWorldGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly gravityWorldService: GravityWorldService) {
  }

  @WebSocketServer() server: Server;

  views = 0;


  async handleConnection() {
    this.views++;
    this.server.emit('views', this.views);
  }

  async handleDisconnect() {
    this.views--;
    this.server.emit('views', this.views);
  }

  @SubscribeMessage('gravity-world-options')
  handleGravityWorldOptions(client: Client, data?: GravityWorldOptionsMessage): Observable<WsResponse<GravityWorldOptionsMessage>> {
    if(data!=null){
      this.gravityWorldService.updateOptions(data.options);
    }
    return this.gravityWorldService.selectOptions().pipe(
      map(options => ({options})),
      concatMap(optionsMessage => of({event: 'gravity-world-option', data: optionsMessage}))
    );
  }

  @SubscribeMessage('gravity-world-steps')
  handleGravityWorld(client: Client, data: unknown): Observable<WsResponse<NextStepMessage>> {
    return this.gravityWorldService.selectBalls().pipe(
      map(balls => ({nextStep: {balls}})),
      concatMap(nextStepData => of({event: 'gravity-world-step', data: nextStepData}))
    );
  }

}
