import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';

import { TodosRoutingModule } from './todos-routing.module';

import { TodosComponent } from './todos.component';

import { ProjectComponent } from './project/project.component';
import { TaskComponent } from './task/task.component'

@NgModule({
  declarations: [
    TodosComponent,
    ProjectComponent,
    TaskComponent
  ],
  imports: [
    SharedModule,
    TodosRoutingModule
  ],
  providers: []
})
export class TodosModule { }
