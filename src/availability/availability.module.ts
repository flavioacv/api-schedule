import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Resource } from '../resources/entities/resource.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Service } from '../services/entities/service.entity';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Schedule, Appointment, Service, Resource]),
    ],
    controllers: [AvailabilityController],
    providers: [AvailabilityService],
})
export class AvailabilityModule { }
