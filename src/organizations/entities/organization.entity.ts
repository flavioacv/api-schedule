import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from '../../resources/entities/resource.entity';
import { Service } from '../../services/entities/service.entity';

@Entity()
export class Organization {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'jsonb', default: {} })
    config: Record<string, any>;

    @OneToMany(() => Resource, (resource) => resource.organization)
    resources: Resource[];

    @OneToMany(() => Service, (service) => service.organization)
    services: Service[];
}
