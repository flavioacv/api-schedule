import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ResourceType } from '../../resources/resource-type.enum';

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
}
