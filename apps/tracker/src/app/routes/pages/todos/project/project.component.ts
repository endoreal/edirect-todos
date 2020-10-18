import { Component, OnInit, ChangeDetectionStrategy, Input, TemplateRef } from '@angular/core';

import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { finalize, map } from 'rxjs/operators';

import { ProjectDto, TaskDto } from '@edirect/api-interfaces';

import { TodosService } from '../../../../shared/services/todos.service';

@Component({
  selector: 'edirect-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.less']
})
export class ProjectComponent implements OnInit {

  loading = true;

  tplModalButtonLoading = false;

  taskName: string;
  taskDate: string;
  taskDescription: string;

  @Input() project: ProjectDto

  tasks: TaskDto[];

  constructor(
    private todosService: TodosService,
    private modal: NzModalService
  ) { }

  get toDoTasks(): TaskDto[] {

    return this.tasks.filter(task => !task.completed)
  }

  get doneTasks(): TaskDto[] {

    return this.tasks.filter(task => task.completed)
  }

  ngOnInit(): void {

    this.todosService.getProjectTasks(this.project._id).pipe(
      finalize(() => { this.loading = false; })
    ).subscribe(tasks => {

      this.tasks = tasks;
    });
  }

  trackTask(index, item) {
    return item._id;
  }

  addTask(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {

    this.modal.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: false,
      nzClosable: false
    });
  }

  submitTask(modelRef: NzModalRef): void {

    const { taskName, taskDate, taskDescription } = this;

    if (taskName && taskDate && taskDescription) {

      this.tplModalButtonLoading = true;

      this.todosService.createTask(this.project._id, {
        title: taskName,
        description: taskDescription,
        due: taskDate
      }).pipe(
        finalize(() => {
          this.tplModalButtonLoading = false;
          modelRef.destroy();
        })
      ).subscribe(tasks => {

        this.tasks = tasks
      })
    }
  }

  cancelTask(modelRef: NzModalRef): void {

    this.taskName = null;
    this.taskDate = null;
    this.taskDescription = null;

    modelRef.destroy();
  }

  deleteTask(taskId: string): void {

    if (taskId) {

      this.todosService.deleteTask(this.project._id, taskId).subscribe(tasks => {

        this.tasks = tasks
      })
    }
  }

  toggleTask(taskId: string, completed: boolean): void {

    if (taskId) {

      this.todosService.toggleTaskCompleted(this.project._id, taskId, completed).subscribe(tasks => {

        this.tasks = tasks
      })
    }
  }

}
