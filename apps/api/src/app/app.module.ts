import {Module} from '@nestjs/common';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TimerSocketModule} from './timer-socket/timer-socket.module';

@Module({
  imports: [TimerSocketModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
