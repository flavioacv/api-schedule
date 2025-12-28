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

    async create(createResourceDto: CreateResourceDto): Promise<Resource> {
        const resource = this.resourceRepository.create(createResourceDto);
        return await this.resourceRepository.save(resource);
    }

    async findAll(organizationId?: string): Promise<Resource[]> {
        if (organizationId) {
            return await this.resourceRepository.find({
                where: { organizationId },
            });
        }
        return await this.resourceRepository.find();
    }

    async findOne(id: string): Promise<Resource> {
        const resource = await this.resourceRepository.findOne({
            where: { id },
        });
        if (!resource) {
            throw new NotFoundException(`Resource with ID "${id}" not found`);
        }
        return resource;
    }

    async update(id: string, updateResourceDto: UpdateResourceDto): Promise<Resource> {
        const resource = await this.findOne(id);
        Object.assign(resource, updateResourceDto);
        return await this.resourceRepository.save(resource);
    }

    async remove(id: string): Promise<void> {
        const result = await this.resourceRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Resource with ID "${id}" not found`);
        }
    }
}
