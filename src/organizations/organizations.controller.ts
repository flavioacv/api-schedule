import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { IntegrationTokenGuard } from '../auth/guards/integration-token.guard';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) { }

    @Get('me')
    @UseGuards(IntegrationTokenGuard)
    @ApiSecurity('integration-token')
    @ApiOperation({ summary: 'Obter detalhes da própria organização (via token)' })
    @ApiResponse({ status: 200, description: 'Detalhes da organização retornados com sucesso.' })
    getMe(@Req() req: any) {
        return this.organizationsService.findOne(req.organizationId);
    }

    @Post()
    @UseGuards(SuperAdminGuard)
    @ApiSecurity('super-admin-key')
    @ApiOperation({ summary: 'Criar uma nova organização' })
    @ApiResponse({ status: 201, description: 'Organização criada com sucesso.' })
    create(@Body() createOrganizationDto: CreateOrganizationDto) {
        return this.organizationsService.create(createOrganizationDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas as organizações' })
    findAll() {
        return this.organizationsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter detalhes de uma organização' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.organizationsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar uma organização' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
        return this.organizationsService.update(id, updateOrganizationDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover uma organização' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.organizationsService.remove(id);
    }
}
