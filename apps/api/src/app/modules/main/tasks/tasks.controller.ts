import { Controller, Post, Get, UseGuards, Req, Param, Body, Delete, Patch } from '@nestjs/common';

import { CreateTaskReq } from '@edirect/api-interfaces';

import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { TasksService } from './tasks.service';
import { OwnsProjectGuard } from '../projects/guards/owns-project.guard';
import { TaskDocument } from './schemas/task.schema';

@UseGuards(JwtAuthGuard, OwnsProjectGuard)
@Controller('project/:project/task')
export class TasksController {

  constructor(
    private readonly tasksService: TasksService
  ) {}

  @Post()
  createTask(@Param('project') project: string, @Body() body: CreateTaskReq): Promise<TaskDocument> {

    return this.tasksService.createTask(body, project);
  }

  @Get()
  findAll(@Param('project') project: string): Promise<TaskDocument[]> {

    return this.tasksService.findAll(project);
  }

  @Delete('/:task')
  deleteTask(@Param('project') project: string, @Param('task') task: string): Promise<void> {

    return this.tasksService.deleteTask(project, task)
  }

  @Patch('/:task')
  toggleTaskCompleted(@Body() body: { completed: boolean }, @Param('task') task: string): Promise<{ completed: boolean }> {

    return this.tasksService.toggleTaskCompleted(task, body.completed)
  }
}
