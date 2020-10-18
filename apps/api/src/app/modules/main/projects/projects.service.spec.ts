import { Test, TestingModule } from '@nestjs/testing';

import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {

  let service: ProjectsService;

  beforeAll(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsService],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {

    expect(service).toBeDefined();
  });
});
