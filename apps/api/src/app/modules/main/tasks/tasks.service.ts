import { Model } from 'mongoose';

import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Task, TaskDocument } from './schemas/task.schema';

import { CreateTaskReq } from '@edirect/api-interfaces';
import { Project, ProjectDocument } from '../projects/schemas/project.schema';

@Injectable()
export class TasksService {

  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Project.name) private projectsModel: Model<ProjectDocument>
  ) {}

  async createTask(createTaskDto: CreateTaskReq, project: string): Promise<TaskDocument> {

    const createdTask = new this.taskModel({
      project,
      ...createTaskDto
    });

    const task = await createdTask.save();

    await this.projectsModel.findById(project).then(async (res) => {

      res.tasks.push(task._id);

      await res.save();
    });

    return task;
  }

  async deleteTask(project: string, _id: string): Promise<void> {

    await this.taskModel.deleteOne({ _id }).exec();

    return;
  }

  async toggleTaskCompleted(_id: string, completed: boolean): Promise<{ completed: boolean }> {

    await this.taskModel.findByIdAndUpdate(_id, { completed }).exec()

    return { completed }
  }

  async findAll(project: string): Promise<TaskDocument[]> {

    return await this.taskModel.find({ project }).exec();
  }
}
