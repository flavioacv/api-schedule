import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourcesService } from './resources.service';

@Controller('resources')
export class ResourcesController {
    constructor(private readonly resourcesService: ResourcesService) { }

    @Post()
    create(@Body() createResourceDto: CreateResourceDto) {
        return this.resourcesService.create(createResourceDto);
    }

    @Get()
    findAll(@Query('organizationId') organizationId?: string) {
        return this.resourcesService.findAll(organizationId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.resourcesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateResourceDto: UpdateResourceDto) {
        return this.resourcesService.update(id, updateResourceDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.resourcesService.remove(id);
    }
}
