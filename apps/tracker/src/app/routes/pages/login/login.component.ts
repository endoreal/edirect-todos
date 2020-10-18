import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';

import { NzNotificationService } from 'ng-zorro-antd/notification';

import { finalize } from 'rxjs/operators';

import { EnvironmentService } from './../../../core/environment/environment.service';
import { AuthenticationService } from './../../../core/authentication/authentication.service';

import { Logger } from './../../../core/logger/logger.service';
import { LoginUserReq } from '@edirect/api-interfaces';

const log = new Logger('Login');

@Component({
  selector: 'edirect-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {

  error: boolean;

  loginForm: FormGroup;

  isLoading = false;
  passwordVisible = false;

  returnUrl: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private appEnvironment: EnvironmentService,
    private authentication: AuthenticationService,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {

    this.returnUrl = this.route.snapshot.queryParams?.returnUrl || '/';

    if (this.appEnvironment.isAuthenticated()) {

      this.router.navigateByUrl(this.returnUrl);
    }

    this.loginForm = this.createForm();
  }

  login() {

    this.setError(false);

    this.isLoading = true;

    const loginContext: LoginUserReq = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authentication
      .login(loginContext)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (result) => {
          if (result) {

            this.setError(false);

            log.debug(`User '${loginContext.email}' successfully logged in.`);

            this.router.navigate([this.returnUrl ?? '/todos']);

          } else {
            this.setError(true);
          }
        },
        (error) => {
          this.setError(true);
        }
      );
  }

  setError(state: boolean): void {

    this.error = state;

    this.loginForm.controls?.email?.updateValueAndValidity();
    this.loginForm.controls?.password?.updateValueAndValidity();

    if (state) {
      this.notification.error(
        'Wrong Credentials',
        'Looks like either your email or password is incorrect. Please try again.'
      );
    }
  }

  private createForm(): FormGroup {

    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.validateIncorrectCred.bind(this)]],
      password: ['', [Validators.required, this.validateIncorrectCred.bind(this)]],
    });
  }

  private validateIncorrectCred(c: FormControl): ValidationErrors | null {

    return this.error ? { incorrect: true } : null;
  }
}
