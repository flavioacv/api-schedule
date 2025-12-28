import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../appointments/entities/appointment.entity';
import { Resource } from '../resources/entities/resource.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Service } from '../services/entities/service.entity';

@Injectable()
export class AvailabilityService {
    constructor(
        @InjectRepository(Schedule)
        private scheduleRepository: Repository<Schedule>,
        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,
        @InjectRepository(Service)
        private serviceRepository: Repository<Service>,
        @InjectRepository(Resource)
        private resourceRepository: Repository<Resource>,
    ) { }

    async getAvailableSlots(resourceId: string, dateStr: string, serviceId: string) {
        // 1. Validate Input
        const service = await this.serviceRepository.findOne({ where: { id: serviceId } });
        if (!service) throw new NotFoundException('Service not found');

        const resource = await this.resourceRepository.findOne({ where: { id: resourceId } });
        if (!resource) throw new NotFoundException('Resource not found');

        const date = new Date(dateStr);
        const dayOfWeek = date.getDay();

        // 2. Get Working Hours
        const schedule = await this.scheduleRepository.findOne({
            where: { resourceId, dayOfWeek },
        });

        if (!schedule) {
            return []; // Not working today
        }

        // 3. Get Existing Appointments
        // We need to query appointments that overlap with the day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const appointments = await this.appointmentRepository.createQueryBuilder('appointment')
            .where('appointment.resourceId = :resourceId', { resourceId })
            .andWhere('appointment.status != :cancelled', { cancelled: AppointmentStatus.CANCELED })
            .andWhere('appointment.startTime >= :startOfDay', { startOfDay })
            .andWhere('appointment.startTime <= :endOfDay', { endOfDay })
            .getMany();

        // 4. Generate Slots
        // Logic: Iterate from startTime to endTime in steps
        // Step size? Usually fixed slots (e.g. 30min) or depends on service duration?
        // Prompts says: "Fixed Slots: 09:00, 09:30" OR "Duration-based".
        // For MVP, let's implement Fixed Slots logic based on service duration or a standard interval (e.g. 15min)
        // Let's assume we scan every 15 minutes to find start times where the service fits.

        const slots = [];
        const interval = 15; // Scan every 15 minutes

        let currentTime = this.parseTime(schedule.startTime, date);
        const endTime = this.parseTime(schedule.endTime, date);
        const breakStart = schedule.breakStart ? this.parseTime(schedule.breakStart, date) : null;
        const breakEnd = schedule.breakEnd ? this.parseTime(schedule.breakEnd, date) : null;

        while (currentTime.getTime() + (service.duration * 60000) <= endTime.getTime()) {
            const slotEnd = new Date(currentTime.getTime() + service.duration * 60000);

            // Check Breaks
            let inBreak = false;
            if (breakStart && breakEnd) {
                // Overlap logic
                if (currentTime < breakEnd && slotEnd > breakStart) {
                    inBreak = true;
                }
            }

            // Check Appointments (Concurrency)
            if (!inBreak) {
                const activeAppointments = appointments.filter(appt => {
                    // Check overlap
                    // appt.start < slotEnd && appt.end > slotStart
                    return appt.startTime < slotEnd && appt.endTime > currentTime;
                });

                if (activeAppointments.length < resource.capacity) {
                    slots.push(new Date(currentTime));
                }
            }

            // Increment
            currentTime = new Date(currentTime.getTime() + interval * 60000);
        }

        return slots;
    }

    private parseTime(timeStr: string, baseDate: Date): Date {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        const d = new Date(baseDate);
        d.setHours(hours, minutes, seconds || 0, 0);
        return d;
    }
}
