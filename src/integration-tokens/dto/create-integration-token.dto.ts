import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateIntegrationTokenDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsUUID()
    organizationId: string;
}
