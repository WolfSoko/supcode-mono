import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface TimerState {
   time: Date;
   views: number;
}

export function createInitialState(): TimerState {
  return {
    time: new Date(),
    views: 0
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'timer' })
export class TimerStore extends Store<TimerState> {

  constructor() {
    super(createInitialState());
  }

}

