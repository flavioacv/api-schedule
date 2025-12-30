import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { IntegrationTokenGuard } from '../auth/guards/integration-token.guard';
import { AppointmentsService } from './appointments.service';

@ApiTags('Appointments')
@ApiSecurity('integration-token')
@Controller('appointments')
@UseGuards(IntegrationTokenGuard)
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    @ApiOperation({ summary: 'Criar um novo agendamento' })
    @ApiResponse({ status: 201, description: 'Agendamento criado com sucesso.' })
    async create(@Body() body: { resourceId: string; serviceId: string; startTime: string }, @Req() req: any) {
        return this.appointmentsService.createAppointment(body, req.organizationId);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os agendamentos da organização' })
    async findAll(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Req() req: any
    ) {
        return this.appointmentsService.findAll(req.organizationId, startDate, endDate);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter detalhes de um agendamento' })
    async findOne(@Param('id') id: string, @Req() req: any) {
        return this.appointmentsService.findOne(id, req.organizationId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Cancelar um agendamento' })
    async cancel(@Param('id') id: string, @Req() req: any) {
        return this.appointmentsService.cancel(id, req.organizationId);
    }
}
