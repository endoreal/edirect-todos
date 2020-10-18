import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ toObject: { versionKey : false } })
export class Task {

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Project' })
  project: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: false })
  completed: boolean;

  @Prop({ required: true, default: () => (new Date().toISOString()) })
  created: string;

  @Prop({ required: true })
  due: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
