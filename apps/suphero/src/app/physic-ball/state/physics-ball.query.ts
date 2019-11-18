import {Injectable} from '@angular/core';
import {Query} from '@datorama/akita';
import {GravityWorldOptions} from '@supcode-mono/api-interfaces';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Ball} from '../ball';
import {PhysicsBallState, PhysicsBallStore} from './physics-ball.store';

@Injectable({
  providedIn: 'root'
})
export class PhysicsBallQuery extends Query<PhysicsBallState> {

  constructor(protected store: PhysicsBallStore) {
    super(store);
  }

  selectOptions(): Observable<GravityWorldOptions> {
    return this.select('options');
  }

  getOptions(): GravityWorldOptions {
    return this.getValue().options;
  }

  selectBalls(): Observable<Ball[]> {
    return this.select().pipe(
      map(state => state.balls.map(Ball.fromGravityBall))
    );

  }
}
