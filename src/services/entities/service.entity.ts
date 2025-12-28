import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { ResourceType } from '../../resources/entities/resource.entity';

@Entity()
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('int')
    duration: number; // in minutes

    @Column('int', { default: 0 })
    bufferTime: number; // in minutes

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({
        type: 'enum',
        enum: ResourceType,
    })
    requiredResourceType: ResourceType;

    @ManyToOne(() => Organization, (organization) => organization.services)
    organization: Organization;

    @Column()
    organizationId: string;
}
