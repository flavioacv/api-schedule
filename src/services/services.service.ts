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

    async create(createServiceDto: CreateServiceDto): Promise<Service> {
        const service = this.serviceRepository.create(createServiceDto);
        return await this.serviceRepository.save(service);
    }

    async findAll(organizationId?: string): Promise<Service[]> {
        if (organizationId) {
            return await this.serviceRepository.find({
                where: { organizationId },
            });
        }
        return await this.serviceRepository.find();
    }

    async findOne(id: string): Promise<Service> {
        const service = await this.serviceRepository.findOne({
            where: { id },
        });
        if (!service) {
            throw new NotFoundException(`Service with ID "${id}" not found`);
        }
        return service;
    }

    async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
        const service = await this.findOne(id);
        Object.assign(service, updateServiceDto);
        return await this.serviceRepository.save(service);
    }

    async remove(id: string): Promise<void> {
        const result = await this.serviceRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Service with ID "${id}" not found`);
        }
    }
}
