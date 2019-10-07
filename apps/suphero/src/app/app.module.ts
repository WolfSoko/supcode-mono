import {CommonModule} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NG_ENTITY_SERVICE_CONFIG } from '@datorama/akita-ng-entity-service';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';
import {TimerModule} from './timer/timer.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    TimerModule
  ],
  providers: [
    {
      provide: NG_ENTITY_SERVICE_CONFIG,
      useValue: { baseUrl: 'https://jsonplaceholder.typicode.com' }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
