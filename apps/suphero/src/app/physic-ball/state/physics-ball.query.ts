import {Injectable} from '@angular/core';
import {Query} from '@datorama/akita';
import {Observable} from 'rxjs';
import {PhysicBallOptions} from '../physic-ball-options';
import {PhysicsBallStore, PhysicsBallState, physicsBallStore} from './physics-ball.store';

@Injectable({
  providedIn: 'root'
})
export class PhysicsBallQuery extends Query<PhysicsBallState> {

  constructor(protected store: PhysicsBallStore) {
    super(store);
  }

  selectOptions(): Observable<PhysicBallOptions> {
    return this.select('options');
  }
}
