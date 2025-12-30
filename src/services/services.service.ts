import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private serviceRepository: Repository<Service>,
    ) { }

    async create(createServiceDto: CreateServiceDto, organizationId: string): Promise<Service> {
        const service = this.serviceRepository.create({
            ...createServiceDto,
            organizationId,
        });
        return await this.serviceRepository.save(service);
    }

    async findAll(organizationId: string): Promise<Service[]> {
        return await this.serviceRepository.find({
            where: { organizationId },
        });
    }

    async findOne(id: string, organizationId: string): Promise<Service> {
        const service = await this.serviceRepository.findOne({
            where: { id, organizationId },
        });
        if (!service) {
            throw new NotFoundException(`Service not found or access denied`);
        }
        return service;
    }

    async update(id: string, updateServiceDto: UpdateServiceDto, organizationId: string): Promise<Service> {
        const service = await this.findOne(id, organizationId);
        Object.assign(service, updateServiceDto);
        return await this.serviceRepository.save(service);
    }

    async remove(id: string, organizationId: string): Promise<void> {
        const service = await this.findOne(id, organizationId);
        await this.serviceRepository.remove(service);
    }
}
