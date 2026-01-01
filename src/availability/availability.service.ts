import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentStatus } from '../appointments/appointment-status.enum';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Organization } from '../organizations/entities/organization.entity';
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
        @InjectRepository(Organization)
        private organizationRepository: Repository<Organization>,
    ) { }

    async getAvailableSlots(resourceId: string, dateStr: string, serviceId: string, organizationId: string) {
        // 0. Validate Date Format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            throw new BadRequestException('Invalid date format (expected YYYY-MM-DD)');
        }
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day); // Creates date at 00:00:00 Local Time

        if (isNaN(date.getTime())) {
            throw new BadRequestException('Invalid date');
        }

        return this.calculateSlotsForDate(resourceId, date, serviceId, organizationId);
    }

    async getNextAvailableDays(resourceId: string, serviceId: string, organizationId: string) {
        const organization = await this.organizationRepository.findOne({ where: { id: organizationId } });
        if (!organization) throw new NotFoundException('Organization not found');

        // 1. Get current date in organization timezone
        const nowInOrgTzStr = new Date().toLocaleString('en-US', { timeZone: organization.timezone });
        const nowInOrgTz = new Date(nowInOrgTzStr);

        // Start from today (at 00:00:00)
        let checkDate = new Date(nowInOrgTz.getFullYear(), nowInOrgTz.getMonth(), nowInOrgTz.getDate());

        const availableDays = [];
        const maxDaysToSearch = 30; // Safety limit
        let daysChecked = 0;

        while (availableDays.length < 5 && daysChecked < maxDaysToSearch) {
            const slots = await this.calculateSlotsForDate(resourceId, new Date(checkDate), serviceId, organizationId);

            if (slots.length > 0) {
                const year = checkDate.getFullYear();
                const month = String(checkDate.getMonth() + 1).padStart(2, '0');
                const day = String(checkDate.getDate()).padStart(2, '0');
                availableDays.push(`${year}-${month}-${day}`);
            }

            // Move to next day
            checkDate.setDate(checkDate.getDate() + 1);
            daysChecked++;
        }

        return availableDays;
    }

    private async calculateSlotsForDate(resourceId: string, date: Date, serviceId: string, organizationId: string) {
        // 1. Validate Input & Ownership
        const service = await this.serviceRepository.findOne({ where: { id: serviceId, organizationId } });
        if (!service) throw new NotFoundException('Service not found or access denied');

        const resource = await this.resourceRepository.findOne({ where: { id: resourceId, organizationId } });
        if (!resource) throw new NotFoundException('Resource not found or access denied');

        const organization = await this.organizationRepository.findOne({ where: { id: organizationId } });
        if (!organization) throw new NotFoundException('Organization not found');

        const dayOfWeek = date.getDay();

        // 2. Get Working Hours
        const schedule = await this.scheduleRepository.findOne({
            where: { resourceId, dayOfWeek },
        });

        if (!schedule) {
            return []; // Not working today
        }

        // 3. Get Existing Appointments
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
        const slots = [];
        const totalDuration = service.duration + (service.bufferTime || 0);
        const interval = service.duration;

        let currentTime = this.parseTime(schedule.startTime, date);
        const endTime = this.parseTime(schedule.endTime, date);
        const breakStart = schedule.breakStart ? this.parseTime(schedule.breakStart, date) : null;
        const breakEnd = schedule.breakEnd ? this.parseTime(schedule.breakEnd, date) : null;

        while (currentTime.getTime() + (totalDuration * 60000) <= endTime.getTime()) {
            const slotEnd = new Date(currentTime.getTime() + totalDuration * 60000);

            let inBreak = false;
            if (breakStart && breakEnd) {
                if (currentTime < breakEnd && slotEnd > breakStart) {
                    inBreak = true;
                }
            }

            if (!inBreak) {
                const activeAppointments = appointments.filter(appt => {
                    return appt.startTime < slotEnd && appt.endTime > currentTime;
                });

                if (activeAppointments.length < resource.capacity) {
                    const nowInOrgTzStr = new Date().toLocaleString('en-US', { timeZone: organization.timezone });
                    const nowInOrgTz = new Date(nowInOrgTzStr);
                    const slotDateTimeInOrg = new Date(currentTime);

                    let isPast = false;
                    if (nowInOrgTz.getFullYear() > slotDateTimeInOrg.getFullYear() ||
                        (nowInOrgTz.getFullYear() === slotDateTimeInOrg.getFullYear() && nowInOrgTz.getMonth() > slotDateTimeInOrg.getMonth()) ||
                        (nowInOrgTz.getFullYear() === slotDateTimeInOrg.getFullYear() && nowInOrgTz.getMonth() === slotDateTimeInOrg.getMonth() && nowInOrgTz.getDate() > slotDateTimeInOrg.getDate())
                    ) {
                        isPast = true;
                    } else if (
                        nowInOrgTz.getFullYear() === slotDateTimeInOrg.getFullYear() &&
                        nowInOrgTz.getMonth() === slotDateTimeInOrg.getMonth() &&
                        nowInOrgTz.getDate() === slotDateTimeInOrg.getDate()
                    ) {
                        if (nowInOrgTz.getHours() > slotDateTimeInOrg.getHours() ||
                            (nowInOrgTz.getHours() === slotDateTimeInOrg.getHours() && nowInOrgTz.getMinutes() >= slotDateTimeInOrg.getMinutes())) {
                            isPast = true;
                        }
                    }

                    if (!isPast) {
                        slots.push(new Date(currentTime));
                    }
                }
            }
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
