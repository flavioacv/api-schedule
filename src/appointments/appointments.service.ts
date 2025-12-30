import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { Between, Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { Resource } from '../resources/entities/resource.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Service } from '../services/entities/service.entity';
import { AppointmentStatus } from './appointment-status.enum';
import { Appointment } from './entities/appointment.entity';

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
        private readonly configService: ConfigService,
    ) {
        this.redis = new Redis({
            host: this.configService.get<string>('REDIS_HOST', 'localhost'),
            port: this.configService.get<number>('REDIS_PORT', 6379),
        });
    }

    async createAppointment(dto: { resourceId: string; serviceId: string; startTime: string }, organizationId: string) {
        const { resourceId, serviceId, startTime } = dto;
        const startDate = new Date(startTime);

        // 1. Acquire Lock
        const lockKey = `lock:appointment:${resourceId}`;
        const acquired = await this.redis.set(lockKey, 'locked', 'EX', 10, 'NX'); // 10 seconds lock

        if (!acquired) {
            throw new ConflictException('Resource is currently being booked by someone else. Please try again.');
        }

        try {
            // 2. Validate Resource & Service ownership
            const resource = await this.resourceRepository.findOne({ where: { id: resourceId, organizationId } });
            const service = await this.serviceRepository.findOne({ where: { id: serviceId, organizationId } });

            if (!resource || !service) throw new NotFoundException('Resource or Service not found or access denied');

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
                organizationId,
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

    async findAll(organizationId: string, startDate?: string, endDate?: string): Promise<Appointment[]> {
        const where: any = { organizationId };

        if (startDate && endDate) {
            where.startTime = Between(new Date(startDate), new Date(endDate));
        } else if (startDate) {
            // Se apenas startDate for fornecido, podemos filtrar de startDate em diante
            where.startTime = Between(new Date(startDate), new Date('9999-12-31'));
        } else if (endDate) {
            // Se apenas endDate for fornecido, podemos filtrar até endDate
            where.startTime = Between(new Date('1970-01-01'), new Date(endDate));
        }

        return this.appointmentRepository.find({
            where,
            relations: ['resource', 'service'],
        });
    }

    async findOne(id: string, organizationId: string): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findOne({
            where: { id, organizationId },
            relations: ['resource', 'service'],
        });
        if (!appointment) throw new NotFoundException('Appointment not found');
        return appointment;
    }

    async cancel(id: string, organizationId: string): Promise<Appointment> {
        const appointment = await this.findOne(id, organizationId);
        appointment.status = AppointmentStatus.CANCELED;
        return this.appointmentRepository.save(appointment);
    }
}
