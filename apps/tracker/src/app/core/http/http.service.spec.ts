import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpInterceptor } from '@angular/common/http';

import { HttpService } from './http.service';
import { HttpCacheService } from './http-cache.service';
import { ErrorHandlerInterceptor } from './interceptors/error-handler.interceptor';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { ApiPrefixInterceptor } from './interceptors/api-prefix.interceptor';
import { EnvironmentService } from '../environment/environment.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '../core.module';
import { TranslateModule } from '@ngx-translate/core';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ChannelDataInterceptor } from './interceptors/channel-data.interceptor';
import { LanguageInterceptor } from './interceptors/language.interceptor';
import { FullPageLoaderInterceptor } from './interceptors/full-page-loader.interceptor';
import { MockInterceptor } from './interceptors/mock.interceptor';

describe('HttpService', () => {
  let httpCacheService: HttpCacheService;
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let interceptors: HttpInterceptor[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: HttpClient,
          useClass: HttpService
        },
        EnvironmentService,
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController as Type<HttpTestingController>);
    httpCacheService = TestBed.inject(HttpCacheService);

    const realRequest = http.request;
    spyOn(HttpService.prototype, 'request').and.callFake(
      function(this: any, method: string, url: string, options?: any) {
        interceptors = this.interceptors;
        return realRequest.call(this, method, url, options);
      }
    );
  });

  afterEach(() => {
    httpCacheService.cleanCache();
    httpMock.verify();
  });
  
  it('should use error handler, API prefix and no cache by default', (done) => {
    // Act
    const request = http.get('/toto');

    // Assert
    request.subscribe(() => {
      expect(http.request).toHaveBeenCalled();
      expect(interceptors.some(i => i instanceof ErrorHandlerInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ApiPrefixInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof TokenInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ChannelDataInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof LanguageInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof FullPageLoaderInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof MockInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof CacheInterceptor)).toBeFalsy();
      done();
    });
    httpMock.expectOne({}).flush({});
  });

  it('should use cache', (done) => {
    // Act
    const request = http.cache().get('/toto');

    // Assert
    request.subscribe(() => {
      expect(interceptors.some(i => i instanceof ErrorHandlerInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ApiPrefixInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof TokenInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ChannelDataInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof LanguageInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof FullPageLoaderInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof MockInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof CacheInterceptor)).toBeTruthy();
      done();
    });
    httpMock.expectOne({}).flush({});
  });

  it('should skip error handler', (done) => {
    // Act
    const request = http.skipErrorHandler().get('/toto');

    // Assert
    request.subscribe(() => {
      expect(interceptors.some(i => i instanceof ErrorHandlerInterceptor)).toBeFalsy();
      expect(interceptors.some(i => i instanceof ApiPrefixInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof TokenInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ChannelDataInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof LanguageInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof FullPageLoaderInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof MockInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof CacheInterceptor)).toBeFalsy();
      done();
    });
    httpMock.expectOne({}).flush({});
  });

  it('should not use API prefix', (done) => {
    // Act
    const request = http.disableApiPrefix().get('/toto');

    // Assert
    request.subscribe(() => {
      expect(interceptors.some(i => i instanceof ErrorHandlerInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ApiPrefixInterceptor)).toBeFalsy();
      expect(interceptors.some(i => i instanceof TokenInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ChannelDataInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof LanguageInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof FullPageLoaderInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof MockInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof CacheInterceptor)).toBeFalsy();
      done();
    });
    httpMock.expectOne({}).flush({});
  });

  it('should use delay', (done) => {
    // Act
    const request = http.delay(2000).get('/toto');

    // Assert
    request.subscribe(() => {
      expect(interceptors.some(i => i instanceof ErrorHandlerInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ApiPrefixInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof TokenInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ChannelDataInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof LanguageInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof FullPageLoaderInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof MockInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof CacheInterceptor)).toBeFalsy();
      done();
    });
    httpMock.expectOne({}).flush({});
  });

  it('should use delay', (done) => {
    // Act
    const request = http.delay().get('/toto');

    // Assert
    request.subscribe(() => {
      expect(interceptors.some(i => i instanceof ErrorHandlerInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ApiPrefixInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof TokenInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ChannelDataInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof LanguageInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof FullPageLoaderInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof MockInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof CacheInterceptor)).toBeFalsy();
      done();
    });
    httpMock.expectOne({}).flush({});
  });

  it('should use no loader', (done) => {
    // Act
    const request = http.noLoader().get('/toto');

    // Assert
    request.subscribe(() => {
      expect(interceptors.some(i => i instanceof ErrorHandlerInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ApiPrefixInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof TokenInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ChannelDataInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof LanguageInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof FullPageLoaderInterceptor)).toBeFalsy();
      expect(interceptors.some(i => i instanceof MockInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof CacheInterceptor)).toBeFalsy();
      done();
    });
    httpMock.expectOne({}).flush({});
  });
});
