import { BadRequestException, Body, Controller, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('integration-token')
    async createToken(
        @Headers('x-super-admin-key') superAdminKey: string,
        @Body() body: { organizationId: string; name: string },
    ) {
        if (superAdminKey !== process.env.SUPER_ADMIN_KEY) {
            throw new UnauthorizedException('Invalid Super Admin Key');
        }

        if (!body.organizationId || !body.name) {
            throw new BadRequestException('organizationId and name are required');
        }

        return this.authService.generateToken(body.organizationId, body.name);
    }
}
