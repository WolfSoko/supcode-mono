import {interval, Observable} from 'rxjs';
import {map, share} from 'rxjs/operators';

export class TimerSocketService {

  private timerInterval$ = interval(500);
  private sharedTimer$: Observable<Date> = this.timerInterval$.pipe(
    map(value => new Date()),
    share());

  getTime$(): Observable<Date> {
    return this.sharedTimer$;
  }

}
