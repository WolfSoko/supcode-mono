import { TimerQuery } from './timer.query';
import { TimerStore } from './timer.store';

describe('TimerQuery', () => {
  let query: TimerQuery;

  beforeEach(() => {
    query = new TimerQuery(new TimerStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});
