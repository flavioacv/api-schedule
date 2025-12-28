import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { Resource } from '../resources/entities/resource.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Service } from '../services/entities/service.entity';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';

@Injectable()
export class AppointmentsService {
    private redis: Redis;

    constructor(
        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,
        @InjectRepository(Resource)
        private resourceRepository: Repository<Resource>,
        @InjectRepository(Service)
        private serviceRepository: Repository<Service>,
        @InjectRepository(Schedule)
        private scheduleRepository: Repository<Schedule>,
        private readonly notificationsService: NotificationsService,
    ) {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT) || 6379,
        });
    }

    async createAppointment(dto: { resourceId: string; serviceId: string; startTime: string }) {
        const { resourceId, serviceId, startTime } = dto;
        const startDate = new Date(startTime);

        // 1. Acquire Lock
        const lockKey = `lock:appointment:${resourceId}`;
        const acquired = await this.redis.set(lockKey, 'locked', 'EX', 10, 'NX'); // 10 seconds lock

        if (!acquired) {
            throw new ConflictException('Resource is currently being booked by someone else. Please try again.');
        }

        try {
            // 2. Validate Resource & Service
            const resource = await this.resourceRepository.findOne({ where: { id: resourceId } });
            const service = await this.serviceRepository.findOne({ where: { id: serviceId } });

            if (!resource || !service) throw new NotFoundException('Resource or Service not found');

            // 3. Calculate End Time
            const duration = service.duration + (service.bufferTime || 0);
            const endDate = new Date(startDate.getTime() + duration * 60000);

            // 4. Check Capacity Logic (Simplified: Check overlapping appointments)
            const overlaps = await this.appointmentRepository.createQueryBuilder('appointment')
                .where('appointment.resourceId = :resourceId', { resourceId })
                .andWhere('appointment.status = :status', { status: AppointmentStatus.CONFIRMED })
                .andWhere('appointment.startTime < :endDate', { endDate })
                .andWhere('appointment.endTime > :startDate', { startDate })
                .getCount();

            if (overlaps >= resource.capacity) {
                throw new ConflictException('No capacity available for this slot.');
            }

            // 5. Create Appointment
            const appointment = this.appointmentRepository.create({
                resourceId,
                serviceId,
                startTime: startDate,
                endTime: endDate,
                status: AppointmentStatus.CONFIRMED,
            });

            const savedAppointment = await this.appointmentRepository.save(appointment);
            await this.notificationsService.sendAppointmentConfirmation(savedAppointment);
            return savedAppointment;

        } catch (error) {
            throw error;
        } finally {
            // 6. Release Lock
            await this.redis.del(lockKey);
        }
    }
}
