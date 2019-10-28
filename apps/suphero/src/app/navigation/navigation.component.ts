import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Component} from '@angular/core';
import {RouterQuery} from '@datorama/akita-ng-router-store';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {routeNamedLinks} from '../app-routing.module';

@Component({
  selector: 'sup-hero-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.less']
})
export class NavigationComponent {
  routeTitle$: Observable<string>;
  isHandset$: Observable<boolean>;
  routeLinks: { path: string; title: string }[];

  constructor(akitaRouterQuery: RouterQuery) {

    this.routeTitle$ = akitaRouterQuery.selectData('title');
    this.routeLinks = routeNamedLinks;
  }
}
