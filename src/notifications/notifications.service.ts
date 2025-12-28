import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);
    private readonly flowBuilderUrl = process.env.FLOWBUILDER_URL || 'http://localhost:5000/webhook';

    constructor(private readonly httpService: HttpService) { }

    async sendAppointmentConfirmation(appointment: any) {
        // Send event to FlowBuilder
        try {
            this.logger.log(`Sending confirmation for appointment ${appointment.id}`);
            // await lastValueFrom(
            //   this.httpService.post(this.flowBuilderUrl, {
            //     event: 'APPOINTMENT_CONFIRMED',
            //     data: appointment,
            //   }),
            // );
            this.logger.log('Notification sent successfully (mocked)');
        } catch (error) {
            this.logger.error('Failed to send notification', error);
            // Don't block main flow
        }
    }
}
