
export const Routes = {
  login: () => '/auth/login',
  createProject: () => '/project',
  allProjects: () => '/project',
  createTask: (projId: string) => `/project/${projId}/task`,
  allProjectTasks: (projId: string) => `/project/${projId}/task`,
  deleteTask: (projId: string, taskId: string) => `/project/${projId}/task/${taskId}`,
  toggleTaskCompleted: (projId: string, taskId: string) => `/project/${projId}/task/${taskId}`
};
