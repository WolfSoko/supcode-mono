import {Injectable, Param} from '@nestjs/common';
import { Message } from '@supcode-mono/api-interfaces';

@Injectable()
export class AppService {
  getData(name: string =  'to sup-code-mono api'): Message {
    return { message: 'Welcome ' + name + '!' };
  }
}
