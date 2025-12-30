import { Injectable } from '@nestjs/common';
import { IntegrationTokensService } from '../integration-tokens/integration-tokens.service';

@Injectable()
export class AuthService {
    constructor(private readonly tokensService: IntegrationTokensService) { }

    async validateToken(token: string) {
        return this.tokensService.validateToken(token);
    }
}
