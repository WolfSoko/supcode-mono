import {Injectable} from '@angular/core';
import {TimerMessage} from '@supcode-mono/api-interfaces';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {TimerStore} from './timer.store';

@Injectable({providedIn: 'root'})
export class TimerService {

  constructor(private timerStore: TimerStore, private socket: Socket) {
  }

  receiveTimerUpdates(): void {
    this.socket.fromEvent<TimerMessage>('time')
      .pipe(tap(timerMessage => this.timerStore.update({time: timerMessage.time})))
      .subscribe();

    this.socket.emit('timer');
  }

  receiveViews(): void {
    this.socket.fromEvent<number>('views')
      .pipe(tap(views => this.timerStore.update({views})))
      .subscribe();
  }

}
