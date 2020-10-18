import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subscription, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { NzI18nService, en_GB, pt_PT } from 'ng-zorro-antd/i18n';

import { AuthenticationService } from './../../core/authentication/authentication.service';
import { EnvironmentService } from './../../core/environment/environment.service';
import { I18nService, SupportedLanguage } from './../../core/i18n/i18n.service';
import { LoaderService } from './../../core/loader/loader.service';
import { PersistenceService } from './../../core/persistence/persistence.service';

import { fadeInOut } from './../../shared/animations/animations.constant';

import { Logger } from './../../core/logger/logger.service';

const log = new Logger('Application Shell');

@UntilDestroy()
@Component({
  selector: 'edirect-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.less'],
  animations: [fadeInOut],
})
export class ShellComponent implements OnInit {

  isLoading: Observable<boolean>;

  sidenavCollapsed = false;

  public shellType: string;

  private shellTypeSubscription: Subscription;

  private alive: boolean;

  private interval: number;
  private delay: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authentication: AuthenticationService,
    private env: EnvironmentService,
    private i18nService: I18nService,
    private persistence: PersistenceService,
    private loader: LoaderService,
    private zorroI18n: NzI18nService,
  ) {

    this.isLoading = this.loader.LoaderNotification.pipe(
      startWith({ show: false }),
      map((state) => {
        return state.show;
      })
    );
  }

  ngOnInit() {

    this.zorroI18n.setLocale(this.NgZorroI18nLocaleFactory(this.i18nService.language));

    this.shellTypeSubscription = this.route.data.pipe(map((data) => data?.shellType), untilDestroyed(this)).subscribe((type) => {

      this.shellType = type;

      this.initShell(this.shellType);
    });
  }

  initShell(shellType: string) {

    if (shellType === 'simple') {

      this.loader.setBackdropVisibility(false);
    }

    if (shellType === 'full') {

      this.loader.setBackdropVisibility(true);
    }
  }

  /**
   * View Stuff
   */

  isActiveRoute(route: string): boolean {

    return this.router.url.startsWith(route);
  }

  /* goTo(area: AREA): void {

    const areaConfig = this.area.getArea(area);

    if (areaConfig) {
      this.router.navigateByUrl(areaConfig.route);
    } else {
      // ERROR
    }
  } */

  get currentUserName(): string {

    return 'Change Me'; // this.env.currentUserDetail.name;
  }

  /**
   * Language
   */

  get languages(): SupportedLanguage[] {

    return this.i18nService.supportedLanguages;
  }

  get language(): SupportedLanguage {

    const selected = this.i18nService.language;

    return this.i18nService.supportedLanguages.find((lang) => lang.code === selected);
  }

  changeLang(langCode: string): void {

    this.i18nService.language = langCode;

    this.zorroI18n.setLocale(this.NgZorroI18nLocaleFactory(langCode));
  }

  flag(code: string): string {

    return `assets/icons/langs/${code}.svg`;
  }

  /**
   * Other
   */

  logout(): void {

    this.persistence.clearCache();

    this.authentication.logout();

    this.router.navigateByUrl('/login');
  }

  private NgZorroI18nLocaleFactory(lang: string) {

    if (lang.startsWith('ar')) {

      return pt_PT;

    } else if (lang.startsWith('en')) {

      return en_GB;

    } else {

      return en_GB;
    }
  }
}
