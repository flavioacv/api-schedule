import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { IntegrationTokenGuard } from '../auth/guards/integration-token.guard';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourcesService } from './resources.service';

@ApiTags('Resources')
@ApiSecurity('integration-token')
@Controller('resources')
@UseGuards(IntegrationTokenGuard)
export class ResourcesController {
    constructor(private readonly resourcesService: ResourcesService) { }

    @Post()
    @ApiOperation({ summary: 'Criar um novo recurso (ex: funcionário, sala)' })
    @ApiResponse({ status: 201, description: 'Recurso criado com sucesso.' })
    create(@Body() createResourceDto: CreateResourceDto, @Req() req: any) {
        return this.resourcesService.create(createResourceDto, req.organizationId);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os recursos da organização' })
    findAll(@Req() req: any) {
        return this.resourcesService.findAll(req.organizationId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter detalhes de um recurso' })
    findOne(@Param('id') id: string, @Req() req: any) {
        return this.resourcesService.findOne(id, req.organizationId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar um recurso' })
    update(@Param('id') id: string, @Body() updateResourceDto: UpdateResourceDto, @Req() req: any) {
        return this.resourcesService.update(id, updateResourceDto, req.organizationId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover um recurso' })
    remove(@Param('id') id: string, @Req() req: any) {
        return this.resourcesService.remove(id, req.organizationId);
    }
}
