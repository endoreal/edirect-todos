import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users/users.controller';
import { ProjectsController } from './projects/projects.controller';
import { TasksController } from './tasks/tasks.controller';

import { UsersService } from './users/users.service';
import { ProjectsService } from './projects/projects.service';
import { TasksService } from './tasks/tasks.service';

import { User, UserSchema } from './users/schemas/user.schema';
import { Project, ProjectSchema } from './projects/schemas/project.schema';
import { Task, TaskSchema } from './tasks/schemas/task.schema';

import { OwnsProjectGuard } from './projects/guards/owns-project.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Task.name, schema: TaskSchema }
    ]),
  ],
  controllers: [
    UsersController,
    ProjectsController,
    TasksController
  ],
  providers: [
    UsersService,
    ProjectsService,
    TasksService,

    OwnsProjectGuard
  ],
  exports: [
    UsersService,
    ProjectsService,
    TasksService
  ]
})
export class MainModule {}
