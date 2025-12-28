import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';

export enum ResourceType {
    STAFF = 'STAFF',
    ASSET = 'ASSET',
    SPACE = 'SPACE',
}

@Entity()
export class Resource {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: ResourceType,
        default: ResourceType.STAFF,
    })
    type: ResourceType;

    @Column({ default: 1 })
    capacity: number;

    @ManyToOne(() => Organization, (organization) => organization.resources)
    organization: Organization;

    @Column()
    organizationId: string;

    @OneToMany(() => Schedule, (schedule) => schedule.resource)
    schedules: Schedule[];

    @OneToMany(() => Appointment, (appointment) => appointment.resource)
    appointments: Appointment[];
}
