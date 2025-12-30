import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { IntegrationTokenGuard } from '../auth/guards/integration-token.guard';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { SchedulesService } from './schedules.service';

@ApiTags('Schedules')
@ApiSecurity('integration-token')
@Controller('schedules')
@UseGuards(IntegrationTokenGuard)
export class SchedulesController {
    constructor(private readonly schedulesService: SchedulesService) { }

    @Post()
    @ApiOperation({ summary: 'Definir horário de trabalho de um recurso' })
    @ApiResponse({ status: 201, description: 'Horário definido com sucesso.' })
    create(@Body() createScheduleDto: CreateScheduleDto, @Req() req: any) {
        return this.schedulesService.create(createScheduleDto, req.organizationId);
    }

    @Get()
    @ApiOperation({ summary: 'Listar configurações de horários' })
    findAll(@Query('resourceId') resourceId: string, @Req() req: any) {
        return this.schedulesService.findAll(resourceId, req.organizationId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter detalhes de uma configuração de horário' })
    findOne(@Param('id') id: string, @Req() req: any) {
        return this.schedulesService.findOne(id, req.organizationId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar configuração de horário' })
    update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto, @Req() req: any) {
        return this.schedulesService.update(id, updateScheduleDto, req.organizationId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover configuração de horário' })
    remove(@Param('id') id: string, @Req() req: any) {
        return this.schedulesService.remove(id, req.organizationId);
    }
}
