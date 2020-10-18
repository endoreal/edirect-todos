import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, Type } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

/**
 * Other
 */
import { RouteReusableStrategy } from './route-strategy/route-reusable-strategy';
import { AuthenticationGuard } from './authentication/authentication.guard';

/**
 * SERVICES
 */
import { I18nService } from './i18n/i18n.service';
import { HttpService } from './http/http.service';
import { HttpCacheService } from './http/http-cache.service';
import { EnvironmentService } from './environment/environment.service';
import { PersistenceService } from './persistence/persistence.service';
import { AuthenticationService } from './authentication/authentication.service';
import { LoaderService } from './loader/loader.service';

/**
 * HTTP INTERCEPTORS
 */
import { ApiPrefixInterceptor } from './http/interceptors/api-prefix.interceptor';
import { ErrorHandlerInterceptor } from './http/interceptors/error-handler.interceptor';
import { CacheInterceptor } from './http/interceptors/cache.interceptor';
import { TokenInterceptor } from './http/interceptors/token.interceptor';
import { LanguageInterceptor } from './http/interceptors/language.interceptor';
import { FullPageLoaderInterceptor } from './http/interceptors/full-page-loader.interceptor';

const INTERCEPTORS: Type<any>[] = [
  ApiPrefixInterceptor,
  ErrorHandlerInterceptor,
  CacheInterceptor,
  TokenInterceptor,
  LanguageInterceptor,
  FullPageLoaderInterceptor,
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    RouterModule
  ],
  providers: [
    AuthenticationService,
    AuthenticationGuard,
    EnvironmentService,
    LoaderService,
    PersistenceService,
    I18nService,
    HttpCacheService,
    ...INTERCEPTORS,
    {
      provide: HttpClient,
      useClass: HttpService
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    },
  ],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }
}
