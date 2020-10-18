export interface Credential {
  token: string;
  expires: number;
}

export interface Privilege {
  name: string;
}

export interface UserDetails {
  name: string;
  username: string;
}

export interface User {
  credential: Credential;
  privileges: Privilege[];
  details: UserDetails;
}
