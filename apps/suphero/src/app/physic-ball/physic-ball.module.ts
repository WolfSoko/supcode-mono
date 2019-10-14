import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {PhysicBallRoutingModule} from './physic-ball-routing.module';
import {PhysicBallComponent} from './physic-ball.component';

@NgModule({
  declarations: [PhysicBallComponent],
  imports: [
    PhysicBallRoutingModule,
  ]
})
export class PhysicBallModule {
}
