import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { TimerStore, TimerState } from './timer.store';

@Injectable({ providedIn: 'root' })
export class TimerQuery extends Query<TimerState> {

  constructor(protected store: TimerStore) {
    super(store);
  }

}
