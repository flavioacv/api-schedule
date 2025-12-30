import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { AuthModule } from '../auth/auth.module';
import { Organization } from '../organizations/entities/organization.entity';
import { Resource } from '../resources/entities/resource.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Service } from '../services/entities/service.entity';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Schedule, Appointment, Service, Resource, Organization]),
        AuthModule,
    ],
    controllers: [AvailabilityController],
    providers: [AvailabilityService],
})
export class AvailabilityModule { }
