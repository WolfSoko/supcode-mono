import {NgModule} from '@angular/core';
import {Data, Route, RouterModule, Routes} from '@angular/router';

export interface SupMonoRouteData extends Data {
  title: string,

  [name: string]: any;
}

interface SupMonoRoute extends Route {
  data?: SupMonoRouteData
}

type SupMonoRoutes = SupMonoRoute[];

const routes: SupMonoRoutes = [
  {path: 'home', loadChildren: () => import('./homepage/homepage.module').then(m => m.HomepageModule), data: {title: 'Home'}},
  {path: 'physic-ball', loadChildren: () => import('./physic-ball/physic-ball.module').then(m => m.PhysicBallModule), data: {title: 'Planets'}},
  {path: '', pathMatch: 'full', redirectTo: '/home'}];

export const routeNamedLinks: { path: string; title: string }[] = routes
  .filter(({path, data}) => path && data)
  .map(({path, data: {title}}) => ({
    path, title
  }));

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
