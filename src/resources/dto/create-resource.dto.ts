import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ResourceType } from '../entities/resource.entity';

export class CreateResourceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(ResourceType)
    @IsNotEmpty()
    type: ResourceType;

    @IsInt()
    @Min(1)
    @IsOptional()
    capacity?: number;

    @IsUUID()
    @IsNotEmpty()
    organizationId: string;
}
