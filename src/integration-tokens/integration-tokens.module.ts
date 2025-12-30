import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { IntegrationToken } from './entities/integration-token.entity';
import { IntegrationTokensController } from './integration-tokens.controller';
import { IntegrationTokensService } from './integration-tokens.service';

@Module({
    imports: [TypeOrmModule.forFeature([IntegrationToken, Organization])],
    controllers: [IntegrationTokensController],
    providers: [IntegrationTokensService],
    exports: [IntegrationTokensService],
})
export class IntegrationTokensModule { }
