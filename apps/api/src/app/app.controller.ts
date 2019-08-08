import {Controller, Get, Param} from '@nestjs/common';

import {Message} from '@supcode-mono/api-interfaces';

import {AppService} from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get('hello')
  getData(): Message {
    return this.getDataWithName();
  }

  @Get('hello/:name')
  getDataWithName(@Param('name') name?: string): Message {
    return this.appService.getData(name);
  }
}
