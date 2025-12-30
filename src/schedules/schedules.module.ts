import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Resource } from '../resources/entities/resource.entity';
import { Schedule } from './entities/schedule.entity';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';

@Module({
    imports: [TypeOrmModule.forFeature([Schedule, Resource]), AuthModule],
    controllers: [SchedulesController],
    providers: [SchedulesService],
    exports: [SchedulesService],
})
export class SchedulesModule { }
