import { IsIn, IsInt, IsOptional, IsString } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class QueryParamApiExternal {
  @ApiProperty({
    example: 1,
    description: 'Número da página a ser consultada.',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'A página deve ser um valor inteiro.' })
  @Type(() => Number)
  page?: number

  @ApiProperty({
    example: 'rick',
    description: 'Filtra resultados pelo nome (case-insensitive).',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O nome deve ser um texto.' })
  @Transform((params) => String(params.value).toLocaleLowerCase().trim())
  name?: string

  @ApiProperty({
    example: 'alive',
    description: 'Filtra resultados pelo status.',
    required: false,
    enum: ['alive', 'dead', 'unknown'],
  })
  @IsOptional()
  @IsString()
  @Transform((params) => String(params.value).toLocaleLowerCase().trim())
  @IsIn(['alive', 'dead', 'unknown'], {
    message: 'O status deve ser apenas alive, dead ou unknown.',
  })
  status?: 'alive' | 'dead' | 'unknown'

  @ApiProperty({
    example: 'male',
    description: 'Filtra resultados pelo gênero.',
    required: false,
    enum: ['female', 'male', 'genderless', 'unknown'],
  })
  @IsOptional()
  @IsString()
  @Transform((params) => String(params.value).toLocaleLowerCase().trim())
  @IsIn(['female', 'male', 'genderless', 'unknown'], {
    message: 'O gênero deve ser apenas female, male, genderless ou unknown.',
  })
  gender?: 'female' | 'male' | 'genderless' | 'unknown'
}
