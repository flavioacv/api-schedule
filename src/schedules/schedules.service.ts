import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class SchedulesService {
    constructor(
        @InjectRepository(Schedule)
        private scheduleRepository: Repository<Schedule>,
    ) { }

    async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
        const schedule = this.scheduleRepository.create(createScheduleDto);
        return await this.scheduleRepository.save(schedule);
    }

    async findAll(resourceId?: string): Promise<Schedule[]> {
        if (resourceId) {
            return await this.scheduleRepository.find({
                where: { resourceId },
                order: { dayOfWeek: 'ASC', startTime: 'ASC' },
            });
        }
        return await this.scheduleRepository.find({
            order: { dayOfWeek: 'ASC', startTime: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Schedule> {
        const schedule = await this.scheduleRepository.findOne({ where: { id } });
        if (!schedule) {
            throw new NotFoundException(`Schedule with ID "${id}" not found`);
        }
        return schedule;
    }

    async update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
        const schedule = await this.findOne(id);
        Object.assign(schedule, updateScheduleDto);
        return await this.scheduleRepository.save(schedule);
    }

    async remove(id: string): Promise<void> {
        const result = await this.scheduleRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Schedule with ID "${id}" not found`);
        }
    }
}
