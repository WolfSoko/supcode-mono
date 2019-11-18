import {Module} from '@nestjs/common';
import {GravityWorldGateway} from './gravity-world.gateway';
import {GravityWorldService} from './gravity-world.service';

@Module({
  providers: [GravityWorldService, GravityWorldGateway]
})
export class GravityWorldSocketModule {}
