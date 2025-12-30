import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';

@Injectable()
export class ResourcesService {
    constructor(
        @InjectRepository(Resource)
        private resourceRepository: Repository<Resource>,
    ) { }

    async create(createResourceDto: CreateResourceDto, organizationId: string): Promise<Resource> {
        const resource = this.resourceRepository.create({
            ...createResourceDto,
            organizationId,
        });
        return await this.resourceRepository.save(resource);
    }

    async findAll(organizationId: string): Promise<Resource[]> {
        return await this.resourceRepository.find({
            where: { organizationId },
        });
    }

    async findOne(id: string, organizationId: string): Promise<Resource> {
        const resource = await this.resourceRepository.findOne({
            where: { id, organizationId },
        });
        if (!resource) {
            throw new NotFoundException(`Resource not found or access denied`);
        }
        return resource;
    }

    async update(id: string, updateResourceDto: UpdateResourceDto, organizationId: string): Promise<Resource> {
        const resource = await this.findOne(id, organizationId);
        Object.assign(resource, updateResourceDto);
        return await this.resourceRepository.save(resource);
    }

    async remove(id: string, organizationId: string): Promise<void> {
        const resource = await this.findOne(id, organizationId);
        await this.resourceRepository.remove(resource);
    }
}
