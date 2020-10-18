import { Controller, Post, Get, Body, UseGuards, Req, Query } from '@nestjs/common';

import { CreateProjectReq } from '@edirect/api-interfaces';

import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { ProjectsService } from './projects.service';
import { Usr } from './../users/decorators/user.decorator'
import { UserDocument } from '../users/schemas/user.schema';
import { ProjectDocument } from './schemas/project.schema';

@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectsController {

  constructor(
    private projectsService: ProjectsService
  ) {}

  @Post()
  createProject(@Usr() user: UserDocument, @Body() body: CreateProjectReq): Promise<ProjectDocument> {

    return this.projectsService.createProject(body, user);
  }

  @Get()
  async findAll(@Usr() user: UserDocument, @Query('expand') expand: boolean): Promise<ProjectDocument[]> {

    if (expand) {

      return await this.projectsService.findAllExpandTasks(user._id) ?? [];
    }

    return await this.projectsService.findAll(user._id) ?? [];;
  }
}
