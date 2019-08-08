import { Injectable } from '@nestjs/common';
import { Message } from '@supcode-mono/api-interfaces';

@Injectable()
export class AppService {
  getData(): Message {
    return { message: 'Welcome to api!' };
  }
}
