import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationsService {
    constructor(
        @InjectRepository(Organization)
        private organizationRepository: Repository<Organization>,
    ) { }

    async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
        const organization = this.organizationRepository.create(createOrganizationDto);
        return await this.organizationRepository.save(organization);
    }

    async findAll(): Promise<Organization[]> {
        return await this.organizationRepository.find();
    }

    async findOne(id: string): Promise<Organization> {
        const organization = await this.organizationRepository.findOne({ where: { id } });
        if (!organization) {
            throw new NotFoundException(`Organization with ID "${id}" not found`);
        }
        return organization;
    }

    async update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
        const organization = await this.findOne(id);
        Object.assign(organization, updateOrganizationDto);
        return await this.organizationRepository.save(organization);
    }

    async remove(id: string): Promise<void> {
        const result = await this.organizationRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Organization with ID "${id}" not found`);
        }
    }
}
