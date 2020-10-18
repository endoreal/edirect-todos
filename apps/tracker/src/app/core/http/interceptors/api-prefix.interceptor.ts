import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from './../../../../environments/environment';

@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const baseUrl = environment.serverUrl;

    if (!/^(http|https):/i.test(request.url)) {
      request = request.clone({ url: baseUrl + request.url });
    }

    return next.handle(request);
  }
}
