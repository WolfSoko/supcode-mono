import {interval, Observable} from 'rxjs';
import {share} from 'rxjs/operators';

export class TimerSocketService {

  private timerInterval$ = interval(1000);
  private sharedTimer$ = this.timerInterval$.pipe(share());

  getTime$(): Observable<number> {
    return this.sharedTimer$;
  }

}
