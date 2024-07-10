import { Test, TestingModule } from '@nestjs/testing';
import { DosenController } from './dosen.controller';
import { DosenService } from './dosen.service';

describe('DosenController', () => {
  let dosenController: DosenController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DosenController],
      providers: [DosenService],
    }).compile();

    dosenController = app.get<DosenController>(DosenController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(dosenController.getHello()).toBe('Hello World!');
    });
  });
});
