import { NgModule } from '@angular/core';
import { Routes, RouterModule, NoPreloading } from '@angular/router';

import { Shell } from './routes/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes('', [
    {
      path: 'todos',
      loadChildren: () => import('./routes/pages/todos/todos.module').then(m => m.TodosModule),
    }
  ]),
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading, useHash: true })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
