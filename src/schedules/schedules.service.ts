import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../resources/entities/resource.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class SchedulesService {
    constructor(
        @InjectRepository(Schedule)
        private scheduleRepository: Repository<Schedule>,
        @InjectRepository(Resource)
        private resourceRepository: Repository<Resource>,
    ) { }

    async create(createScheduleDto: CreateScheduleDto, organizationId: string): Promise<Schedule> {
        // Validate resource ownership
        await this.validateResourceOwnership(createScheduleDto.resourceId, organizationId);

        const schedule = this.scheduleRepository.create(createScheduleDto);
        return await this.scheduleRepository.save(schedule);
    }

    async findAll(resourceId: string, organizationId: string): Promise<Schedule[]> {
        await this.validateResourceOwnership(resourceId, organizationId);

        return await this.scheduleRepository.find({
            where: { resourceId },
            order: { dayOfWeek: 'ASC', startTime: 'ASC' },
        });
    }

    async findOne(id: string, organizationId: string): Promise<Schedule> {
        const schedule = await this.scheduleRepository.findOne({
            where: { id },
            relations: ['resource'],
        });

        if (!schedule || schedule.resource.organizationId !== organizationId) {
            throw new NotFoundException(`Schedule not found or access denied`);
        }

        return schedule;
    }

    async update(id: string, updateScheduleDto: UpdateScheduleDto, organizationId: string): Promise<Schedule> {
        const schedule = await this.findOne(id, organizationId);
        Object.assign(schedule, updateScheduleDto);
        return await this.scheduleRepository.save(schedule);
    }

    async remove(id: string, organizationId: string): Promise<void> {
        const schedule = await this.findOne(id, organizationId);
        await this.scheduleRepository.remove(schedule);
    }

    private async validateResourceOwnership(resourceId: string, organizationId: string) {
        const resource = await this.resourceRepository.findOne({
            where: { id: resourceId, organizationId },
        });
        if (!resource) {
            throw new NotFoundException(`Resource not found or access denied`);
        }
    }
}
