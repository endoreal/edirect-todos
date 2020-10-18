import { TestBed } from '@angular/core/testing';

import { EnvironmentService } from './environment.service';

jest.mock('@conf/privileges.constant', () => ({
  PRIVILEGE: {
    FIRST: 'first',
  },
}));

jest.mock('./environment.constant', () => ({
  APPSTATE: {
    TEST: 'test',
  },
}));

describe('EnvironmentService', () => {
  let envService: EnvironmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnvironmentService],
    });

    envService = TestBed.inject(EnvironmentService);
  });

  it('should be created', () => {
    expect(envService).toBeTruthy();
  });

  describe('saveCurrentUserFromAuthenticate', () => {
    it('should set user', () => {
      const result = envService.saveCurrentUserFromAuthenticate({
        name: 'John Doe',
        userName: 'johndoe',
        privileges: [
          {
            name: 'first',
          },
        ],
        token: 'token',
        tokenExpires: new Date().valueOf() + 30 * 60000,
      });

      expect(result).toBeTruthy();
      expect(envService.currentUserDetail).toBeTruthy();
    });

    it('should remove user', () => {
      const result = envService.saveCurrentUserFromAuthenticate({
        name: 'John Doe',
        userName: 'johndoe',
        privileges: null,
        token: null,
        tokenExpires: null,
      });

      expect(result).toBeFalsy();
    });
  });

  describe('isAuthenticated', () => {
    it('should be authenticated', () => {
      envService.saveCredentials({
        token: 'token',
        expires: new Date().valueOf() + 30 * 60000,
      });

      const result = envService.isAuthenticated();

      expect(result).toBeTruthy();
    });

    it('should not be authenticated', () => {
      envService.saveCredentials({
        token: 'token',
        expires: new Date().valueOf() - 30 * 60000,
      });

      const result = envService.isAuthenticated();

      expect(result).toBeFalsy();
    });

    it('should not be authenticated', () => {
      envService.saveCredentials();

      const result = envService.isAuthenticated();

      expect(result).toBeFalsy();
    });

    it('should not be authenticated', () => {
      envService.saveCurrentUser();

      const result = envService.isAuthenticated();

      expect(result).toBeFalsy();
    });
  });

  describe('doesTokenRequireRefresh', () => {
    it('should not require refresh', () => {
      envService.saveCredentials({
        token: 'token',
        expires: new Date().valueOf() + 30 * 60000,
      });

      const result = envService.doesTokenRequireRefresh();

      expect(result).toBeFalsy();
    });

    it('should require refresh', () => {
      envService.saveCredentials({
        token: 'token',
        expires: new Date().valueOf() + 5 * 60000,
      });

      const result = envService.doesTokenRequireRefresh();

      expect(result).toBeTruthy();
    });
  });

  describe('refreshToken', () => {
    it('should refresh token', () => {
      envService.refreshTokenSuccess({
        token: 'token',
        tokenExpires: new Date().valueOf() + 30 * 60000,
      });

      expect(envService.isAuthenticated()).toBeTruthy();
      expect(envService.credential).toBeTruthy();
    });

    it('should not refresh token', () => {
      envService.refreshTokenSuccess({
        error: 'Error',
        token: null,
        tokenExpires: null,
      });

      expect(envService.isAuthenticated()).toBeFalsy();
      expect(envService.credential).toBeFalsy();
    });

    it('should remove token', () => {
      envService.refreshTokenError();

      expect(envService.isAuthenticated()).toBeFalsy();
      expect(envService.credential).toBeFalsy();
    });
  });

  describe('savePrivilege', () => {
    it('should set privileges', () => {
      envService.savePrivilege([{ name: 'first' }]);

      const result = envService.doesUserHavePrivilege('first');

      expect(result).toBeTruthy();
    });

    it('should remove privileges', () => {
      envService.savePrivilege();

      const { PRIVILEGE } = require('@conf/privileges.constant');

      const result = envService.doesUserHavePrivilege(PRIVILEGE.FIRST);

      expect(result).toBeFalsy();
    });
  });

  describe('clearUser', () => {
    it('should remove active user', () => {
      envService.clearUser();

      expect(envService.currentUser).toBeFalsy();
      expect(envService.currentUserDetail).toBeFalsy();
    });
  });

  describe('orientation', () => {
    it('should have orientation ltr', () => {
      envService.orientation = 'ltr';

      expect(envService.isLeftToRight).toBeTruthy();
      expect(envService.isRightToLeft).toBeFalsy();
    });

    it('should have orientation rtl', () => {
      envService.orientation = 'rtl';

      expect(envService.isRightToLeft).toBeTruthy();
      expect(envService.isLeftToRight).toBeFalsy();
    });
  });

  describe('notifyNavigationTreeChange', () => {
    it('should notify changes', (done) => {
      const { APPSTATE } = require('./environment.constant');

      envService.notifyNavigationTreeChange(APPSTATE.TEST);

      envService.ApplicationStateNotification.subscribe((notification) => {
        expect(notification.state).toBe('test');

        done();
      });
    });
  });
});
