import {Module} from '@nestjs/common';
import {TimerSocketGateway} from './timer-socket.gateway';
import {TimerSocketService} from './timer-socket.service';

@Module({
  imports: [TimerSocketGateway],
  controllers: [],
  providers: [TimerSocketService]
})
export class TimerSocketModule {}
