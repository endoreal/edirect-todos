import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { en_GB, NZ_I18N, pt_PT } from 'ng-zorro-antd/i18n';

import { I18nService } from './../core/i18n/i18n.service';
import { NGZORROCONFIG } from './../../config/ng-zorro.constant';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

const ZORROMODULES: Type<any>[] = [
  NzButtonModule,
  NzIconModule,
  NzGridModule,
  NzLayoutModule,
  NzSpinModule,
  NzSpaceModule,
  NzCardModule,
  NzFormModule,
  NzInputModule,
  NzDropDownModule,
  NzAvatarModule,
  NzDividerModule,
  NzBackTopModule,
  NzNotificationModule,
  NzTabsModule,
  NzBadgeModule,
  NzCollapseModule,
  NzDatePickerModule,
  NzModalModule,
  NzAlertModule,
  NzPopconfirmModule
];

const NgZorroI18nLocaleFactory = (translate: I18nService) => {

  if (translate.language.startsWith('pt')) {

    return pt_PT;

  } else if (translate.language.startsWith('en')) {

    return en_GB;

  } else {

    return en_GB;
  }
};


/**
 * COMPONENTS
 */
import { InlineLoaderComponent } from './components/inline-loader/inline-loader.component';

const COMPONENTS: Type<any>[] = [
  InlineLoaderComponent,
];



@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...ZORROMODULES
  ],
  exports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...ZORROMODULES,
    ...COMPONENTS,
  ],
  providers: [
    {
      provide: NZ_I18N,
      useFactory: NgZorroI18nLocaleFactory,
      deps: [I18nService],
    },
    {
      provide: NZ_CONFIG,
      useValue: NGZORROCONFIG,
    },
  ],
  declarations: [
    ...COMPONENTS,
  ],
})
export class SharedModule {}
