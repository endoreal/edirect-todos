import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateProjectReq } from '@edirect/api-interfaces';

import { Project, ProjectDocument } from './schemas/project.schema';
import { UserDocument } from '../users/schemas/user.schema';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';

@Injectable()
export class ProjectsService {

  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async createProject(createProjectDto: CreateProjectReq, user: UserDocument): Promise<ProjectDocument> {

    const createdProject = new this.projectModel({
      name: createProjectDto.name,
      user: user._id
    });

    return await createdProject.save();
  }

  async findAllExpandTasks(user: string): Promise<ProjectDocument[]> {

    return await this.projectModel.find({ user }).populate('tasks').exec();
  }

  async findAll(user: string): Promise<ProjectDocument[]> {

    return await this.projectModel.find({ user }).exec();
  }

  async findOne(_id: string, user: string) {

    return await this.projectModel.findOne({ _id, user }).exec()
  }

  async findById(_id: string) {

    return await this.projectModel.findOne({ _id }).exec()
  }
}
