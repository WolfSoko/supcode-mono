import {Injectable} from '@angular/core';
import {Store, StoreConfig} from '@datorama/akita';
import {GravityBall, GravityWorldOptions} from '@supcode-mono/api-interfaces';


export interface PhysicsBallState {
  options: GravityWorldOptions;
  balls: GravityBall[]
}

export function createInitialState(): PhysicsBallState {
  return {
    options: null,
    balls: []
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

