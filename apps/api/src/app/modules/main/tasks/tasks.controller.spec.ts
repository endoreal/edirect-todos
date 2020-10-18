import { Test, TestingModule } from '@nestjs/testing';

import { TasksController } from './tasks.controller';

describe('Tasks Controller', () => {

  let module: TestingModule;

  beforeAll(async () => {

    module = await Test.createTestingModule({
      controllers: [TasksController],
    }).compile();
  });

  it('should be defined', () => {

    const controller: TasksController = module.get<TasksController>(TasksController);

    expect(controller).toBeDefined();
  });

});
