import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { Resource } from '../resources/entities/resource.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Service } from '../services/entities/service.entity';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Appointment, Resource, Service, Schedule]),
        NotificationsModule,
        AuthModule,
    ],
    controllers: [AppointmentsController],
    providers: [AppointmentsService],
})
export class AppointmentsModule { }
