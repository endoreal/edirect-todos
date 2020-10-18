import { TestBed } from '@angular/core/testing';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { extract, I18nService } from './i18n.service';
import { EnvironmentService } from '../environment/environment.service';

const defaultLanguage = 'en-GB';
const supportedLanguages = [
  {
    code: 'eo',
    label: 'English',
    orientation: 'ltr',
  },
  {
    code: 'en-GB',
    label: 'English',
    orientation: 'ltr',
  },
  {
    code: 'es-CL',
    label: 'Español Chile',
    orientation: 'ltr',
  },
];

class MockTranslateService {
  currentLang = '';
  onLangChange = new Subject();

  use(language: string) {
    this.currentLang = language;
    this.onLangChange.next({
      lang: this.currentLang,
      translations: {},
    });
  }

  getBrowserCultureLang() {
    return 'en-GB';
  }

  setTranslation(lang: string, translations: object, shouldMerge?: boolean) {}
}

describe('I18nService', () => {
  let i18nService: I18nService;
  let translateService: TranslateService;
  let onLangChangeSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [I18nService, EnvironmentService, { provide: TranslateService, useClass: MockTranslateService }],
    });

    i18nService = TestBed.inject(I18nService);
    translateService = TestBed.inject(TranslateService);

    // Create spies
    onLangChangeSpy = jasmine.createSpy('onLangChangeSpy');
    translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      onLangChangeSpy(event.lang);
    });
    spyOn(translateService, 'use').and.callThrough();
  });

  afterEach(() => {
    // Cleanup
    localStorage.removeItem('language');
  });

  describe('extract', () => {
    it('should not modify string', () => {
      expect(extract('Hello world !')).toEqual('Hello world !');
    });
  });

  describe('init', () => {
    it('should init with default language', () => {
      // Act
      i18nService.init(defaultLanguage, supportedLanguages);

      // Assert
      expect(translateService.use).toHaveBeenCalledWith(defaultLanguage);
      expect(onLangChangeSpy).toHaveBeenCalledWith(defaultLanguage);
    });

    it('should init with save language', () => {
      // Arrange
      const savedLanguage = 'eo';
      localStorage.setItem('language', savedLanguage);

      // Act
      i18nService.init(defaultLanguage, supportedLanguages);

      // Assert
      expect(translateService.use).toHaveBeenCalledWith(savedLanguage);
      expect(onLangChangeSpy).toHaveBeenCalledWith(savedLanguage);
    });
  });

  describe('set language', () => {
    it('should change current language', () => {
      // Arrange
      const newLanguage = 'eo';
      i18nService.init(defaultLanguage, supportedLanguages);

      // Act
      i18nService.language = newLanguage;

      // Assert
      expect(translateService.use).toHaveBeenCalledWith(newLanguage);
      expect(onLangChangeSpy).toHaveBeenCalledWith(newLanguage);
    });

    it('should change current language without a region match', () => {
      // Arrange
      const newLanguage = 'es-PE';
      i18nService.init(defaultLanguage, supportedLanguages);

      // Act
      i18nService.language = newLanguage;

      // Assert
      expect(translateService.use).toHaveBeenCalledWith('es-CL');
      expect(onLangChangeSpy).toHaveBeenCalledWith('es-CL');
    });

    it('should change current language to default if unsupported', () => {
      // Arrange
      const newLanguage = 'fr';
      i18nService.init(defaultLanguage, supportedLanguages);

      // Act
      i18nService.language = newLanguage;

      // Assert
      expect(translateService.use).toHaveBeenCalledWith(defaultLanguage);
      expect(onLangChangeSpy).toHaveBeenCalledWith(defaultLanguage);
    });
  });

  describe('get language', () => {
    it('should return current language', () => {
      // Arrange
      i18nService.init(defaultLanguage, supportedLanguages);

      // Act
      const currentLanguage = i18nService.language;

      // Assert
      expect(currentLanguage).toEqual(defaultLanguage);
    });
  });
});
