import { TimerStore } from './timer.store';

describe('TimerStore', () => {
  let store: TimerStore;

  beforeEach(() => {
    store = new TimerStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});
