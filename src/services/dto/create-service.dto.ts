import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ResourceType } from '../../resources/entities/resource.entity';

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @Min(1)
    @IsNotEmpty()
    duration: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    bufferTime?: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsEnum(ResourceType)
    @IsNotEmpty()
    requiredResourceType: ResourceType;

    @IsUUID()
    @IsNotEmpty()
    organizationId: string;
}
