import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from '../../resources/entities/resource.entity';

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Resource, (resource) => resource.schedules)
    resource: Resource;

    @Column()
    resourceId: string;

    @Column('int')
    dayOfWeek: number; // 0=Sunday, 6=Saturday

    @Column('time')
    startTime: string;

    @Column('time')
    endTime: string;

    @Column('time', { nullable: true })
    breakStart: string;

    @Column('time', { nullable: true })
    breakEnd: string;
}
