
export interface Message {
  message: string;
}


/**
 * Main
 */

export interface UserDto {
  _id: string;
  email: string;
}

export interface UserPasswordDto extends UserDto {
  password: string;
}

export interface ProjectDto {
  user: string;
  tasks: string[] | TaskDto[];
  _id: string;
  name: string;
  created: string;
}

export interface TaskDto {
  project: string;
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  created: string;
  due: string;
}

export interface Jwt {
  access_token: string;
  expires: number;
  user: UserDto;
}

export interface ProjectWithTasksDto extends ProjectDto {
  tasks: TaskDto[];
}


/**
 * API
 */

export interface CreateUserReq {
  email: string;
  password: string;
}

export interface LoginUserReq {
  email: string;
  password: string;
}

export interface CreateProjectReq {
  name: string;
}

export interface CreateTaskReq {
  title: string;
  description: string;
  due: string;
}
