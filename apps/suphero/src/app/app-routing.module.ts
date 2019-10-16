import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {HomepageComponent} from './homepage/homepage.component';


const routes: Routes = [
  {path: 'home', loadChildren: () => import('./homepage/homepage.module').then(m => m.HomepageModule)},
  {path: 'physic-ball', loadChildren: () => import('./physic-ball/physic-ball.module').then(m => m.PhysicBallModule)},
  {path: '', pathMatch: 'full', redirectTo: '/home'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
