import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { IntegrationTokenGuard } from '../auth/guards/integration-token.guard';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

@ApiTags('Services')
@ApiSecurity('integration-token')
@Controller('services')
@UseGuards(IntegrationTokenGuard)
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Post()
    @ApiOperation({ summary: 'Criar um novo serviço' })
    @ApiResponse({ status: 201, description: 'Serviço criado com sucesso.' })
    create(@Body() createServiceDto: CreateServiceDto, @Req() req: any) {
        return this.servicesService.create(createServiceDto, req.organizationId);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os serviços da organização' })
    findAll(@Req() req: any) {
        return this.servicesService.findAll(req.organizationId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter detalhes de um serviço' })
    findOne(@Param('id') id: string, @Req() req: any) {
        return this.servicesService.findOne(id, req.organizationId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar um serviço' })
    update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto, @Req() req: any) {
        return this.servicesService.update(id, updateServiceDto, req.organizationId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover um serviço' })
    remove(@Param('id') id: string, @Req() req: any) {
        return this.servicesService.remove(id, req.organizationId);
    }
}
