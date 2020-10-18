import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EnvironmentService } from '../../environment/environment.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    public environmentService: EnvironmentService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.environmentService.isAuthenticated()) {

      const token = this.environmentService.currentToken.access_token

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}
