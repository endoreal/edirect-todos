import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID, Type, NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

/**
* DEFAULT MODULES
*/
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { ShellModule } from './routes/shell/shell.module';
import { LoginModule } from './routes/pages/login/login.module';
import { TodosModule } from './routes/pages/todos/todos.module';

const MODULES: Type<unknown>[] = [
 CoreModule,
 SharedModule,
 ShellModule,
 LoginModule,
 TodosModule
];

const locale = environment.locale;

import enGB from '@angular/common/locales/en-GB';
import ptPT from '@angular/common/locales/pt-PT';

registerLocaleData(enGB, 'en-GB');
registerLocaleData(ptPT, 'pt-PT');

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.serviceworker }),
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    ...MODULES,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: locale,
    }
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}
