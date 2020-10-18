import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '../../../core/i18n/i18n.service';
import { Shell } from '../../shell/shell.service';

import { LoginComponent } from './login.component';

const routes: Routes = [
  Shell.childRoutesNoAuthentication('login', [
    { path: '', component: LoginComponent, data: { title: extract('login.name') } },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class LoginRoutingModule {}
