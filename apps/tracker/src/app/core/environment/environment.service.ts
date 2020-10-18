import { Injectable } from '@angular/core';

import { currentTokenKey } from './environment.constant';

import { Logger } from '../logger/logger.service';

import { Jwt } from '@edirect/api-interfaces';

const log = new Logger('Environment Service');

@Injectable()
export class EnvironmentService {

  /**
   * Session Linked Variables
   */
  private _currentToken: Jwt;

  constructor() {

    this._currentToken = JSON.parse(sessionStorage.getItem(currentTokenKey));
  }

  /**
   * Authentication Helpers
   */

  public isAuthenticated(): boolean {

    const token: string = this._currentToken?.access_token;

    return token && this.isTokenExpired();
  }

  public isTokenExpired(): boolean {

    return (new Date().valueOf()) < this._currentToken.expires;
  }

  public saveCurrentToken(user?: Jwt): void {

    this._currentToken = user ?? null;

    if (user) {
      sessionStorage.setItem(currentTokenKey, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(currentTokenKey);
    }
  }

  public saveCurrentTokenFromAuthenticate(auth: Jwt): boolean {

    const { access_token, expires } = auth;

    if (access_token && expires) {

      this.saveCurrentToken(auth);

      return true;
    }

    return false;
  }

  public get currentToken(): Jwt {

    return this._currentToken;
  }

  public clearToken(): void {

    this.saveCurrentToken();
  }
}
