import { Injectable } from '@angular/core';

import { Subscription } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { EnvironmentService } from '../environment/environment.service';

import { environment } from './../../../environments/environment';

/**
 * Langs
 */
import enGB from './../../../translations/en-GB.json';
import arIQ from './../../../translations/pt-PT.json';

import { Logger } from '../logger/logger.service';

const log = new Logger('I18n Service');

const languageKey = 'language';

export interface SupportedLanguage {
  code: string;
  orientation: string;
  label: string;
}

export function extract(s: string) {
  return s;
}

@Injectable()
export class I18nService {

  defaultLanguage: string;
  supportedLanguages: SupportedLanguage[];

  private langChangeSubscription!: Subscription;

  constructor(private translateService: TranslateService, private app: EnvironmentService) {

    translateService.setTranslation('en-GB', enGB);
    translateService.setTranslation('pt-PT', arIQ);
  }

  init(defaultLanguage: string, supportedLanguages: SupportedLanguage[]) {

    this.defaultLanguage = defaultLanguage;
    this.supportedLanguages = supportedLanguages;

    this.language = '';

    this.langChangeSubscription = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      localStorage.setItem(languageKey, event.lang);
    });
  }

  set language(language: string) {

    language = language || localStorage.getItem(languageKey) || this.translateService.getBrowserCultureLang();

    let supportedLanguage = this.supportedLanguages.find((lang) => lang.code === language);

    if (language && !supportedLanguage) {
      language = language.split('-')[0];

      supportedLanguage = this.supportedLanguages.find((lang) => lang.code.startsWith(language));
    }

    if (!supportedLanguage) {
      supportedLanguage = this.supportedLanguages.find((lang) => lang.code === this.defaultLanguage);
    }

    language = supportedLanguage.code;

    this.translateService.use(language);

    log.debug(`Language set to ${language}`);
  }

  /**
   * Gets the current language.
   */
  get language(): string {

    return (
      this.translateService.currentLang ||
      localStorage.getItem(languageKey) ||
      this.translateService.getBrowserCultureLang() ||
      environment.defaultLanguage
    );
  }

  appendTranslation(lang: string, translation: any) {

    this.translateService.setTranslation(lang, translation, true);
  }

  destroy() {

    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
}
