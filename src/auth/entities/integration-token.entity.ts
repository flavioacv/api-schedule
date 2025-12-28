import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';

@Entity()
export class IntegrationToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    token: string;

    @Column()
    name: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
    organization: Organization;

    @Column()
    organizationId: string;
}
