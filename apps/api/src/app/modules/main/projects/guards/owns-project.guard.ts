import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ProjectsService } from '../projects.service';

@Injectable()
export class OwnsProjectGuard implements CanActivate {

  constructor(
    private projectsService: ProjectsService
  ) {}

  canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();

    return this.validateRequest(request.params.project, request.user._id);
  }

  async validateRequest(project, user) {

    const found = await this.projectsService.findOne(project, user);

    return !!found;
  }
}
