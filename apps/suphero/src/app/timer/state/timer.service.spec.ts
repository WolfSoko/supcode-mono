import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TimerService } from './timer.service';
import { TimerStore } from './timer.store';

describe('TimerService', () => {
  let timerService: TimerService;
  let timerStore: TimerStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimerService, TimerStore],
      imports: [ HttpClientTestingModule ]
    });

    timerService = TestBed.get(TimerService);
    timerStore = TestBed.get(TimerStore);
  });

  it('should be created', () => {
    expect(timerService).toBeDefined();
  });

});
