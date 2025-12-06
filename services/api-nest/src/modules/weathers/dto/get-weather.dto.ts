import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class GetWeathersDto {
  @ApiProperty({
    example: 20,
    description: 'Limite de itens por página.',
    required: false,
    default: 20,
    minimum: 1,
    maximum: 50,
  })
  @IsInt({ message: 'O limit deve ser um valor inteiro.' })
  @Max(50, { message: 'O limit deve ser menor ou igual a 50.' })
  @Min(1, { message: 'O limit deve ser maior ou igual a 1.' })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20

  @ApiProperty({
    example: 0,
    description: 'Deslocamento (offset) para a paginação.',
    required: false,
    default: 0,
    minimum: 0,
  })
  @IsInt({ message: 'O offset deve ser um valor inteiro.' })
  @Min(0, { message: 'O offset não pode ser negativo.' })
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0
}
