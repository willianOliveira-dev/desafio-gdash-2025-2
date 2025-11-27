import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetWeathersDto {
    // limit
    @IsInt({ message: 'O limit deve ser um valor inteiro.' })
    @Max(50, { message: 'O limit deve ser menor ou igual a 50.' })
    @Min(1, { message: 'O limit deve ser maior ou igual a 1.' })
    @IsOptional()
    @Type(() => Number)
    limit?: number = 20;
    // offset
    @IsInt({ message: 'O offset deve ser um valor inteiro.' })
    @Min(0, { message: 'O offset não pode ser negativo.' })
    @IsOptional()
    @Type(() => Number)
    offset?: number = 0;
    // city
    @IsOptional()
    @IsString({ message: 'O nome da cidade deve ser um texto.' })
    city?: string;
}
