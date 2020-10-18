import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { I18nService } from '../../i18n/i18n.service';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {

  constructor(
    public i18n: I18nService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const language = this.i18n.language;

    request = request.clone({
      setHeaders: {
        'Content-Language': language,
      },
    });

    return next.handle(request);
  }
}
