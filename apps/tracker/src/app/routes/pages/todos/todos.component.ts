import { Component, OnInit } from '@angular/core';
import { ProjectDto } from '@edirect/api-interfaces';
import { Observable } from 'rxjs';

import { TodosService } from '../../../shared/services/todos.service';

@Component({
  selector: 'edirect-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.less']
})
export class TodosComponent implements OnInit {

  _projects: Observable<ProjectDto[]>;

  constructor(
    private todosService: TodosService
  ) { }

  ngOnInit() {

    this._projects = this.todosService.getUserProjects()
  }

}
