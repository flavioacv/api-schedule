import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from '../../resources/entities/resource.entity';
import { Service } from '../../services/entities/service.entity';

export enum AppointmentStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELED = 'CANCELED',
}

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Resource, (resource) => resource.appointments)
    resource: Resource;

    @Column()
    resourceId: string;

    @ManyToOne(() => Service)
    service: Service;

    @Column()
    serviceId: string;

    @Column('timestamp')
    startTime: Date;

    @Column('timestamp')
    endTime: Date;

    @Column({
        type: 'enum',
        enum: AppointmentStatus,
        default: AppointmentStatus.PENDING,
    })
    status: AppointmentStatus;
}
