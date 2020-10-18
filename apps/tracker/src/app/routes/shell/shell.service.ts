import { Routes, Route } from '@angular/router';

import { ShellComponent } from './shell.component';

import { AuthenticationGuard } from './../../core/authentication/authentication.guard';

export class Shell {
  /**
   * Creates routes using the shell component with authentication.
   */
  static childRoutes(basePath: string, routes: Routes): Route {
    return {
      path: basePath,
      component: ShellComponent,
      children: routes,
      canActivate: [AuthenticationGuard],
      data: {
        shellType: 'full',
        reuse: true,
      },
    };
  }

  /**
   * Creates routes using the shell component without authentication.
   */
  static childRoutesNoAuthentication(basePath: string, routes: Routes): Route {
    return {
      path: basePath,
      component: ShellComponent,
      children: routes,
      data: {
        shellType: 'simple',
        reuse: false,
      },
    };
  }
}
