import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { IntegrationToken } from './entities/integration-token.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(IntegrationToken)
        private readonly tokenRepository: Repository<IntegrationToken>,
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>,
    ) { }

    async generateToken(organizationId: string, name: string): Promise<IntegrationToken> {
        const organization = await this.organizationRepository.findOne({ where: { id: organizationId } });
        if (!organization) {
            throw new NotFoundException('Organization not found');
        }

        const token = crypto.randomBytes(32).toString('hex');

        const integrationToken = this.tokenRepository.create({
            token,
            name,
            organization,
        });

        return this.tokenRepository.save(integrationToken);
    }

    async validateToken(token: string): Promise<IntegrationToken | null> {
        return this.tokenRepository.findOne({
            where: { token, isActive: true },
            relations: ['organization'],
        });
    }
}
