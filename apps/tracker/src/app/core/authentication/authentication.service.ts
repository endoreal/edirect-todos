import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../../environments/environment';

import { EnvironmentService } from '../environment/environment.service';
import { PersistenceService } from '../persistence/persistence.service';

import { Jwt, LoginUserReq } from '@edirect/api-interfaces'

@Injectable()
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService,
    private persistenceService: PersistenceService
  ) {}

  login(body: LoginUserReq): Observable<boolean> {

    return this.http
      .noLoader()
      .post<Jwt>(environment.routes.login(), body)
      .pipe(
        map((resp) => {
          return this.environmentService.saveCurrentTokenFromAuthenticate(resp);
        })
      );
  }

  logout(): void {

    this.environmentService.clearToken();
    this.persistenceService.clearCache();
  }
}
