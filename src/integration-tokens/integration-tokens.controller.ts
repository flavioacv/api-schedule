import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { CreateIntegrationTokenDto } from './dto/create-integration-token.dto';
import { UpdateIntegrationTokenDto } from './dto/update-integration-token.dto';
import { IntegrationTokensService } from './integration-tokens.service';

@ApiTags('Integration Tokens')
@ApiSecurity('super-admin-key')
@Controller('integration-tokens')
@UseGuards(SuperAdminGuard)
export class IntegrationTokensController {
    constructor(private readonly tokensService: IntegrationTokensService) { }

    @Post()
    @ApiOperation({ summary: 'Criar um novo token de integração' })
    @ApiResponse({ status: 201, description: 'Token criado com sucesso.' })
    create(@Body() createDto: CreateIntegrationTokenDto) {
        return this.tokensService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os tokens de integração' })
    findAll() {
        return this.tokensService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter detalhes de um token' })
    findOne(@Param('id') id: string) {
        return this.tokensService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar um token' })
    update(@Param('id') id: string, @Body() updateDto: UpdateIntegrationTokenDto) {
        return this.tokensService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover um token' })
    remove(@Param('id') id: string) {
        return this.tokensService.remove(id);
    }
}
