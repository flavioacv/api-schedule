import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Organization } from './entities/organization.entity';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

@Module({
    imports: [TypeOrmModule.forFeature([Organization]), ConfigModule, AuthModule],
    controllers: [OrganizationsController],
    providers: [OrganizationsService],
    exports: [OrganizationsService],
})
export class OrganizationsModule { }
