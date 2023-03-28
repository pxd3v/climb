import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.matchRoles(roles, user);
  }

  matchRoles(roles: Array<string>, user: Partial<User>): boolean {
    const rules = {
      admin: () => user.isAdmin,
    };
    const ruleChecks = roles.map((role) => rules[role]?.());
    return ruleChecks.every((check) => check);
  }
}
