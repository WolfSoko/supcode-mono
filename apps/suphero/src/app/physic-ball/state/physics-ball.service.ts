import {Injectable} from '@angular/core';
import {createDefaultPhysicsBallOption} from '../physic-ball-options';
import {PhysicsBallStore, physicsBallStore} from './physics-ball.store';

@Injectable({
  providedIn: 'root'
})
export class PhysicsBallService {

  constructor(private store: PhysicsBallStore) {
  }

  resetOptions() {
    this.store.update({options: createDefaultPhysicsBallOption()});
  }
}
