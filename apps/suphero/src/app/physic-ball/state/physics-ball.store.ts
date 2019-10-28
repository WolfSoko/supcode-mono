import {Injectable} from '@angular/core';
import {Store, StoreConfig} from '@datorama/akita';
import {createDefaultPhysicsBallOption, PhysicBallOptions} from '../physic-ball-options';

export interface PhysicsBallState {
  options: PhysicBallOptions;
}

export function createInitialState(): PhysicsBallState {
  return {
    options: createDefaultPhysicsBallOption()
  };
}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({name: 'physics-ball'})
export class PhysicsBallStore extends Store<PhysicsBallState> {

  constructor() {
    super(createInitialState());
  }

}

export const physicsBallStore = new PhysicsBallStore();

