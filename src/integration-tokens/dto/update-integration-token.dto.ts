import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateIntegrationTokenDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
