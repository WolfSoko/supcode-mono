import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PhysicBallComponent} from './physic-ball.component';


const routes: Routes = [{path: '', component: PhysicBallComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhysicBallRoutingModule {
}
