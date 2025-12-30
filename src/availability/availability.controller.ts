import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { IntegrationTokenGuard } from '../auth/guards/integration-token.guard';
import { AvailabilityService } from './availability.service';

@ApiTags('Availability')
@ApiSecurity('integration-token')
@Controller('availability')
@UseGuards(IntegrationTokenGuard)
export class AvailabilityController {
    constructor(private readonly availabilityService: AvailabilityService) { }

    @Get('slots')
    @ApiOperation({ summary: 'Consultar horários disponíveis' })
    @ApiResponse({ status: 200, description: 'Lista de horários livres retornada com sucesso.' })
    async getSlots(
        @Query('resourceId') resourceId: string,
        @Query('date') date: string,
        @Query('serviceId') serviceId: string,
        @Req() req: any,
    ) {
        return this.availabilityService.getAvailableSlots(resourceId, date, serviceId, req.organizationId);
    }
}
