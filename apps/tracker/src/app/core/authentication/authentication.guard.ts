import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Logger } from '../logger/logger.service';
import { EnvironmentService } from '../environment/environment.service';

const log = new Logger('AuthenticationGuard');

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router, private environmentService: EnvironmentService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this.environmentService.isAuthenticated()) {
      return true;
    }

    log.debug('Not authenticated, redirecting...');

    this.environmentService.clearToken();

    const params = Object.assign({}, route.queryParams);

    params.returnUrl = state.url;

    this.router.navigate(['/login'], { queryParams: params });

    return false;
  }
}
