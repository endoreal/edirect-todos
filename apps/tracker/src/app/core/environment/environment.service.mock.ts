import { PRIVILEGE } from '@conf/privileges.constant';

import { User } from './environment.interface';

export class MockEnvironmentService {
  private _currentUser: User = {
    credential: {
      token: 'token',
      expires: new Date().valueOf() + 30 * 60000
    },
    details: {
      name: 'John Doe',
      username: 'johndoe'
    },
    privileges: [
      {
        name: 'first'
      }
    ]
  };

  doesUserHavePrivilege(privilege: PRIVILEGE | string): boolean {
    return !!this._currentUser.privileges.find((priv) => priv.name === privilege);
  }
}
