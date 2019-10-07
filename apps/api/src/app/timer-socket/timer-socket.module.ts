import {Module} from '@nestjs/common';
import {TimerSocketGateway} from './timer-socket.gateway';
import {TimerSocketService} from './timer-socket.service';

@Module({
  providers: [TimerSocketService, TimerSocketGateway]
})
export class TimerSocketModule {}
