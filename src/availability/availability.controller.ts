import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { IntegrationTokenGuard } from '../auth/guards/integration-token.guard';
import { AvailabilityService } from './availability.service';

@Controller('availability')
@UseGuards(IntegrationTokenGuard)
export class AvailabilityController {
    constructor(private readonly availabilityService: AvailabilityService) { }

    @Get('slots')
    async getSlots(
        @Query('resourceId') resourceId: string,
        @Query('date') date: string,
        @Query('serviceId') serviceId: string,
    ) {
        return this.availabilityService.getAvailableSlots(resourceId, date, serviceId);
    }
}
