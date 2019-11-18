import {Module} from '@nestjs/common';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {GravityWorldSocketModule} from './gravity-world/gravity-world-socket.module';

@Module({
  imports: [/*TimerSocketModule,*/ GravityWorldSocketModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
