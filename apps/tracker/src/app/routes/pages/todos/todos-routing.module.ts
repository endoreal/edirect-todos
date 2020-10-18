import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from '../../shell/shell.service';
import { extract } from '../../../core/i18n/i18n.service';

import { TodosComponent } from './todos.component';

const routes: Routes = [
  Shell.childRoutes('', [
    { path: '', redirectTo: '/todos', pathMatch: 'full' },
    { path: 'todos', component: TodosComponent, data: { title: extract('gateway.name') } },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodosRoutingModule { }
