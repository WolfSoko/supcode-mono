import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NG_ENTITY_SERVICE_CONFIG} from '@datorama/akita-ng-entity-service';

import {HomepageRoutingModule} from './homepage-routing.module';
import {HomepageComponent} from './homepage.component';
import {TimerModule} from './timer/timer.module';


@NgModule({
  declarations: [HomepageComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    HomepageRoutingModule,
    TimerModule
  ],
  providers: [{
    provide: NG_ENTITY_SERVICE_CONFIG,
    useValue: {baseUrl: 'https://jsonplaceholder.typicode.com'}
  }]
})
export class HomepageModule {
}
