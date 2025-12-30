import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ResourceType } from '../resource-type.enum';

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
}
