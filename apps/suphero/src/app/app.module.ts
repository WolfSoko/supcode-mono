import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';

const config: SocketIoConfig = {url: 'http://localhost:3333', options: {}};

@NgModule({
  declarations: [AppComponent],
  imports: [
    SocketIoModule.forRoot(config),
    AppRoutingModule,
    BrowserModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
