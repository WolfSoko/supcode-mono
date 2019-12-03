import {Injectable} from '@angular/core';
import {GravityWorldOptions, GravityWorldOptionsMessage, NextStepMessage} from '@supcode-mono/api-interfaces';
import {Socket} from 'ngx-socket-io';
import {tap} from 'rxjs/operators';

import {PhysicsBallStore} from './physics-ball.store';

@Injectable({
  providedIn: 'root'
})
export class PhysicsBallService {

  constructor(private store: PhysicsBallStore, private socket: Socket) {

    this.socket.fromEvent<GravityWorldOptionsMessage>('gravity-world-option')
      .pipe(
        tap(optionsMessage => this.updateOptionsState(optionsMessage.options)),
      )
      .subscribe();
    this.socket.emit('gravity-world-options');

    this.socket.fromEvent<NextStepMessage>('gravity-world-step')
      .pipe(
        tap(nextStepMessage => this.store.update({balls: nextStepMessage.nextStep.balls})),
      )
      .subscribe();
    this.socket.emit('gravity-world-steps');
  }

  updateOptions(options: GravityWorldOptions) {
    this.socket.emit('gravity-world-options', {options: options});
  }

  private updateOptionsState(options: GravityWorldOptions) {
    this.store.update({options: options});
  }

  disconnect() {
    this.socket.disconnect();
  }
}
