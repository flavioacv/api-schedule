import { Module } from '@nestjs/common';
import { IntegrationTokensModule } from '../integration-tokens/integration-tokens.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [IntegrationTokensModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule { }
