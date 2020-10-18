import { Inject, Injectable, InjectionToken, Injector, Optional, Type } from '@angular/core';
import { HttpClient, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ErrorHandlerInterceptor } from './interceptors/error-handler.interceptor';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { ApiPrefixInterceptor } from './interceptors/api-prefix.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { LanguageInterceptor } from './interceptors/language.interceptor';
import { FullPageLoaderInterceptor } from './interceptors/full-page-loader.interceptor';

declare module '@angular/common/http/http' {
  export interface HttpClient {
    /**
     * Enables caching for this request.
     */
    cache(forceUpdate?: boolean): HttpClient;

    /**
     * Disables the Full Page Loader for this request.
     */
    noLoader(): HttpClient;

    /**
     * Skips default error handler for this request.
     */
    skipErrorHandler(): HttpClient;

    /**
     * Do not use API prefix for this request.
     */
    disableApiPrefix(): HttpClient;
  }
}

class HttpInterceptorHandler implements HttpHandler {

  constructor(
    private next: HttpHandler,
    private interceptor: HttpInterceptor
  ) {}

  handle(request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {

    return this.interceptor.intercept(request, this.next);
  }
}

export const HTTP_DYNAMIC_INTERCEPTORS = new InjectionToken<HttpInterceptor>('HTTP_DYNAMIC_INTERCEPTORS');

@Injectable()
export class HttpService extends HttpClient {

  constructor(
    private httpHandler: HttpHandler,
    private injector: Injector,
    @Optional()
    @Inject(HTTP_DYNAMIC_INTERCEPTORS)
    private interceptors: HttpInterceptor[] = []
  ) {

    super(httpHandler);

    if (!this.interceptors) {

      this.interceptors = [
        this.injector.get(ErrorHandlerInterceptor),
        this.injector.get(ApiPrefixInterceptor),
        this.injector.get(TokenInterceptor),
        this.injector.get(LanguageInterceptor),
        this.injector.get(FullPageLoaderInterceptor),
      ];
    }
  }

  cache(forceUpdate?: boolean): HttpClient {

    const cacheInterceptor = this.injector.get(CacheInterceptor).configure({ update: forceUpdate });

    return this.addInterceptor(cacheInterceptor);
  }

  skipErrorHandler(): HttpClient {

    return this.removeInterceptor(ErrorHandlerInterceptor);
  }

  noLoader(): HttpClient {

    return this.removeInterceptor(FullPageLoaderInterceptor);
  }

  disableApiPrefix(): HttpClient {

    return this.removeInterceptor(ApiPrefixInterceptor);
  }

  request(method?: any, url?: any, options?: any): any {

    const handler = this.interceptors.reduceRight(
      (next, interceptor) => new HttpInterceptorHandler(next, interceptor), this.httpHandler
    );

    return new HttpClient(handler).request(method, url, options);
  }

  private removeInterceptor(interceptorType: Type<any>): HttpService {

    return new HttpService(
      this.httpHandler,
      this.injector,
      this.interceptors.filter((i) => !(i instanceof interceptorType))
    );
  }

  private addInterceptor(interceptor: HttpInterceptor): HttpService {

    return new HttpService(this.httpHandler, this.injector, [interceptor, ...this.interceptors]);
  }
}
