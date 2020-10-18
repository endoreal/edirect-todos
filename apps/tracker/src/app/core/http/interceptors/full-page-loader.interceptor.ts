import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpEventType } from '@angular/common/http';

import { Observable } from 'rxjs';
import { finalize, catchError, map } from 'rxjs/operators';

import { LoaderService } from './../../loader/loader.service';

@Injectable()
export class FullPageLoaderInterceptor implements HttpInterceptor {

  constructor(
    public loader: LoaderService
  ) {}

  /**
   * Handles the Full Page Loader
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(

      catchError((error) => {
        throw error;
      }),

      finalize(() => this.decreaseLoaderCount()),

      map((response) => {

        if (response.type === HttpEventType.Sent) {

          this.increaseLoaderCount();
        }

        return response;
      })
    );
  }

  private increaseLoaderCount() {

    setTimeout(() => this.loader.increaseCallCount());
  }

  private decreaseLoaderCount() {

    setTimeout(() => this.loader.decreaseCallCount());
  }
}
