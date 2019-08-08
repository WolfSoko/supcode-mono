import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService]
    }).compile();
  });

  describe('getData', () => {
    it('should return "Welcome to api!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getData()).toEqual({ message: 'Welcome to sup-code-mono api!' });
    });
  });

  describe('getData with name', () => {
    it('should return ', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getDataWithName('MyName')).toEqual({ message: 'Welcome MyName!' });
    });
  });
});
