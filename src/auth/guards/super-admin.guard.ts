import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SuperAdminGuard implements CanActivate {
    constructor(private configService: ConfigService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const superAdminKey = request.headers['x-super-admin-key'];
        const expectedKey = this.configService.get<string>('SUPER_ADMIN_KEY');

        if (!superAdminKey || superAdminKey !== expectedKey) {
            throw new UnauthorizedException('Invalid or missing Super Admin Key');
        }

        request.isSuperAdmin = true;
        return true;
    }
}
