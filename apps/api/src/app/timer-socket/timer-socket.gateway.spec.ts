import {Test, TestingModule} from '@nestjs/testing';
import {Observable} from 'rxjs';
import {Server} from 'socket.io';
import {TimerSocketGateway} from './timer-socket.gateway';
import {TimerSocketService} from './timer-socket.service';

describe('TimerSocketGateway', () => {
  let app: TestingModule;
  let timerGateway: TimerSocketGateway;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      providers: [TimerSocketGateway, TimerSocketService]
    }).compile();

    timerGateway = app.get<TimerSocketGateway>(TimerSocketGateway);
    timerGateway.server = {emit: jest.fn()} as unknown as Server;
  });

  function expectServerEmitToHaveBeendCalledWithViewsCount(expectedViews: number) {
    expect(timerGateway.views).toEqual(expectedViews);
    expect(timerGateway.server.emit).toHaveBeenCalledWith('views', expectedViews);
  }

  describe('handleConnection()', () => {
    it('should return 1', () => {
      timerGateway.handleConnection();
      expectServerEmitToHaveBeendCalledWithViewsCount(1);
    });
  });

  describe('handleDisconnect()', () => {

    beforeEach(() => {
      timerGateway.handleConnection();
    });

    it('should return 0', () => {
      timerGateway.handleDisconnect();
      expectServerEmitToHaveBeendCalledWithViewsCount(0);
    });
  });

  describe('handleTimer', () => {
    it('should return observable', () => {
      const observable = timerGateway.handleTimer({} as any, {});
      expect(observable).toBeInstanceOf(Observable);
    });
  });
});
