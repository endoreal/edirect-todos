import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';

import { merge } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

import { environment } from './../environments/environment';

import { I18nService } from './core/i18n/i18n.service';
import { LoaderService } from './core/loader/loader.service';

import { Logger } from './core/logger/logger.service';

const log = new Logger('App');

@UntilDestroy()
@Component({
  selector: 'edirect-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private translateService: TranslateService,
    private i18nService: I18nService,
    private loader: LoaderService
  ) {}

  ngOnInit() {

    if (environment.production) {

      Logger.enableProductionMode();
    }

    log.debug('App starting...');

    this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

    this.router.events.pipe(untilDestroyed(this)).subscribe((event) => {

      if (event instanceof RouteConfigLoadStart) {

        this.loader.increaseCallCount();

      } else if (event instanceof RouteConfigLoadEnd) {

        this.loader.decreaseCallCount();
      }
    });

    const onNavigationEnd = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));

    merge(this.translateService.onLangChange, onNavigationEnd)
      .pipe(
        map(() => {

          let route = this.activatedRoute;

          while (route.firstChild) {

            route = route.firstChild;
          }

          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data),
        untilDestroyed(this)
      )
      .subscribe((event) => {

        const title = event.title;

        if (title) {

          this.titleService.setTitle(`Tracker - ${this.translateService.instant(title)}`);
        }
      });
  }

  ngOnDestroy() {
    this.i18nService.destroy();
  }
}
