import { Test } from '@nestjs/testing';
import {Observable} from 'rxjs';

import { TimerSocketService } from './timer-socket.service';

describe('TimerSocketService', () => {
  let service: TimerSocketService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [TimerSocketService]
    }).compile();

    service = app.get<TimerSocketService>(TimerSocketService);
  });

  describe('getTime$', () => {
    it('should return an observable', () => {
      expect(service.getTime$()).toBeInstanceOf(Observable);
    });
  });
});
