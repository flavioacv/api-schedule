import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { CreateIntegrationTokenDto } from './dto/create-integration-token.dto';
import { UpdateIntegrationTokenDto } from './dto/update-integration-token.dto';
import { IntegrationToken } from './entities/integration-token.entity';

@Injectable()
export class IntegrationTokensService {
    constructor(
        @InjectRepository(IntegrationToken)
        private readonly tokenRepository: Repository<IntegrationToken>,
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>,
    ) { }

    async create(createDto: CreateIntegrationTokenDto): Promise<IntegrationToken> {
        const organization = await this.organizationRepository.findOne({
            where: { id: createDto.organizationId },
        });

        if (!organization) {
            throw new NotFoundException('Organization not found');
        }

        const token = crypto.randomBytes(32).toString('hex');

        const integrationToken = this.tokenRepository.create({
            token,
            name: createDto.name,
            organization,
        });

        return this.tokenRepository.save(integrationToken);
    }

    async findAll(): Promise<IntegrationToken[]> {
        return this.tokenRepository.find({ relations: ['organization'] });
    }

    async findOne(id: string): Promise<IntegrationToken> {
        const token = await this.tokenRepository.findOne({
            where: { id },
            relations: ['organization'],
        });

        if (!token) {
            throw new NotFoundException('Token not found');
        }

        return token;
    }

    async update(id: string, updateDto: UpdateIntegrationTokenDto): Promise<IntegrationToken> {
        const token = await this.findOne(id);
        Object.assign(token, updateDto);
        return this.tokenRepository.save(token);
    }

    async remove(id: string): Promise<void> {
        const token = await this.findOne(id);
        await this.tokenRepository.remove(token);
    }

    async validateToken(token: string): Promise<IntegrationToken | null> {
        return this.tokenRepository.findOne({
            where: { token, isActive: true },
            relations: ['organization'],
        });
    }
}
