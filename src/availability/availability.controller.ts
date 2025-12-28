import { Controller, Get, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('availability')
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
