import { LoginComponent } from '@app/routes/pages/login/login.component';
import { CoreModule } from '@app/core/core.module';

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvironmentService } from '@app/core/environment/environment.service';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { LoginContext } from '@app/core/authentication/authentication.interface';

// ng zorro
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

class MockAuthService extends AuthenticationService {
  login(user: LoginContext): Observable<boolean> {
    return of({}).pipe(
      map(() => {
        if (user.username === 'teste@readinessit.com') {
          throwError({ error: 'error login' });
        } else if (user.username === 'teste') {
          return false;
        } else {
          return true;
        }
      })
    );
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: any;
  let spyRouter: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        CoreModule,
        HttpClientModule,
        NzDropDownModule,
        NzSpinModule,
        NzButtonModule,
        NzIconModule,
        NzSpaceModule,
        NzFormModule,
        NzNotificationModule,
      ],
      providers: [
        EnvironmentService,
        { provide: AuthenticationService, useClass: MockAuthService },
        TranslateService,
        NzNotificationService,
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    router = TestBed.inject(Router);
    spyRouter = spyOn(router, 'navigate');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create login component', () => {
    expect(component).toBeTruthy();
  });

  it('form should be valid when controls username and password are filled', () => {
    expect(component.loginForm.valid).toBeFalsy();
    component.loginForm.controls.username.setValue('testUsername@readinessit.com');
    component.loginForm.controls.password.setValue('123456789');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('login unsuccefull, throwing error in subscription', () => {
    component.loginForm.controls.username.setValue('teste@readinessit.com');
    component.loginForm.controls.password.setValue('teste');
    expect(component.loginForm.valid).toBeTruthy();
    component.login();

    fixture.detectChanges();
    expect(component.error).not.toBeFalsy();
    expect(spyRouter).not.toHaveBeenCalled();
  });

  it('login unsuccefull', () => {
    component.loginForm.controls.username.setValue('teste');
    component.loginForm.controls.password.setValue('teste');
    expect(component.loginForm.valid).toBeTruthy();
    component.login();

    fixture.detectChanges();
    expect(component.error).not.toBeFalsy();
    expect(spyRouter).not.toHaveBeenCalled();
  });

  it('login succefully', () => {
    component.loginForm.controls.username.setValue('teste123');
    component.loginForm.controls.password.setValue('teste');
    expect(component.loginForm.valid).toBeTruthy();
    component.login();

    fixture.detectChanges();
    expect(component.error).toBeFalsy();
    expect(spyRouter).toHaveBeenCalled();
  });
});
