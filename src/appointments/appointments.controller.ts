import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IntegrationTokenGuard } from '../auth/guards/integration-token.guard';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
@UseGuards(IntegrationTokenGuard)
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    async create(@Body() body: { resourceId: string; serviceId: string; startTime: string }) {
        return this.appointmentsService.createAppointment(body);
    }
}
