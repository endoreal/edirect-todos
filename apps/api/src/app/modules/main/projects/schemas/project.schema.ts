import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Task } from '../../tasks/schemas/task.schema';

export type ProjectDocument = Project & Document;

@Schema({ toObject: { versionKey : false } })
export class Project {

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Task' }])
  tasks: Task[];

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: () => (new Date().toISOString()) })
  created: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
