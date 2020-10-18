import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../../../../environments/environment';

import { EnvironmentService } from '../../environment/environment.service';

import { Logger } from '../../logger/logger.service';

const log = new Logger('ErrorHandlerInterceptor');

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(
    public appEnvironment: EnvironmentService,
    public router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(catchError((error) => this.errorHandler(error)));
  }

  private errorHandler(response: any): Observable<any> {

    if (response instanceof HttpErrorResponse) {

      if (response.status === 401) {

        log.error('Request error', 'Unauthorized.');

        this.appEnvironment.saveCurrentToken();

        this.router.navigate(['/login'], { replaceUrl: true });

      } else if (response.error && response.error.code) {

        // this.toaster.errorTranslate(response.error.message, response.error.code);
      }
    }

    if (!environment.production) {

      log.error('Request error', response);
    }

    throw response;
  }
}
