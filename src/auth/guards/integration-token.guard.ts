import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class IntegrationTokenGuard implements CanActivate {
    constructor(private readonly authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers['x-integration-token'] || this.extractTokenFromBearer(request.headers['authorization']);

        if (!token) {
            throw new UnauthorizedException('Integration token missing');
        }

        const integrationToken = await this.authService.validateToken(token);
        if (!integrationToken) {
            throw new UnauthorizedException('Invalid integration token');
        }

        // Attach organization to request object for easy access in controllers
        request.organization = integrationToken.organization;
        return true;
    }

    private extractTokenFromBearer(authorization: string): string | undefined {
        if (!authorization) return undefined;
        const parts = authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            return parts[1];
        }
        return undefined;
    }
}
