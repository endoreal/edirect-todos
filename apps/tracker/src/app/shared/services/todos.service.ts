import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateTaskReq, ProjectDto, TaskDto } from '@edirect/api-interfaces';

import { environment } from '../../../environments/environment';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(
    private http: HttpClient
  ) { }

  getUserProjects(expand: boolean = false): Observable<ProjectDto[]> {

    let params = new HttpParams();

    if (expand) {

      params = params.set('expand', 'true');
    }

    return this.http.get<ProjectDto[]>(environment.routes.allProjects(), { params })
  }

  getProjectTasks(projectId: string): Observable<TaskDto[]> {

    return this.http.noLoader().get<TaskDto[]>(environment.routes.allProjectTasks(projectId))
  }

  createTask(projectId: string, task: CreateTaskReq): Observable<TaskDto[]> {

    return this.http.post<TaskDto>(environment.routes.allProjectTasks(projectId), task).pipe(
      switchMap(() => this.getProjectTasks(projectId))
    )
  }

  deleteTask(projectId: string, taskId: string): Observable<TaskDto[]> {

    return this.http.delete<void>(environment.routes.deleteTask(projectId, taskId)).pipe(
      switchMap(() => this.getProjectTasks(projectId))
    )
  }

  toggleTaskCompleted(projectId: string, taskId: string, completed: boolean): Observable<TaskDto[]> {

    return this.http.patch<{ completed: boolean }>(environment.routes.toggleTaskCompleted(projectId, taskId), { completed }).pipe(
      switchMap(() => this.getProjectTasks(projectId))
    )
  }

}
