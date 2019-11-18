import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatSliderModule} from '@angular/material/slider';
import {MatTableModule} from '@angular/material/table';
import {SocketIoModule} from 'ngx-socket-io';
import {PhysicBallRoutingModule} from './physic-ball-routing.module';
import {PhysicBallComponent} from './physic-ball.component';

@NgModule({
  declarations: [PhysicBallComponent],
  imports: [
    PhysicBallRoutingModule,
    MatInputModule,
    MatSliderModule,
    MatCardModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    SocketIoModule
  ]
})
export class PhysicBallModule {
}
