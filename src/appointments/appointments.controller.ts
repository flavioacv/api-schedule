import { Body, Controller, Post } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    async create(@Body() body: { resourceId: string; serviceId: string; startTime: string }) {
        return this.appointmentsService.createAppointment(body);
    }
}
