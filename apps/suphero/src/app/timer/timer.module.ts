import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {TimerComponent} from './timer.component';

const config: SocketIoConfig = {url: 'http://localhost:3333', options: {}};

@NgModule({
  declarations: [TimerComponent],
  imports: [
    CommonModule,
    SocketIoModule.forRoot(config)
  ],
  exports: [
    TimerComponent
  ]
})
export class TimerModule {
}
