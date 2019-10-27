import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatInputModule, MatSliderModule} from '@angular/material';
import {PhysicBallRoutingModule} from './physic-ball-routing.module';
import {PhysicBallComponent} from './physic-ball.component';

@NgModule({
  declarations: [PhysicBallComponent],
  imports: [
    PhysicBallRoutingModule,
    MatInputModule,
    MatSliderModule
  ]
})
export class PhysicBallModule {
}
