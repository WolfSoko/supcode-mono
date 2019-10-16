import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {TimerComponent} from './timer.component';


@NgModule({
  declarations: [TimerComponent],
  imports: [
    CommonModule,
    SocketIoModule
  ],
  exports: [
    TimerComponent
  ]
})
export class TimerModule {
}
