import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IntegrationToken } from './entities/integration-token.entity';

@Module({
    imports: [TypeOrmModule.forFeature([IntegrationToken, Organization])],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule { }
