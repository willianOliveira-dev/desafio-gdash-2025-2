import { ApiProperty } from '@nestjs/swagger'

export class LocationModelSwaggerDto {
  @ApiProperty({ example: 1, description: 'ID da localização.' })
  id: number

  @ApiProperty({
    example: 'Earth (C-137)',
    description: 'Nome da localização.',
  })
  name: string

  @ApiProperty({ example: 'Planet', description: 'Tipo da localização.' })
  type: string

  @ApiProperty({
    example: 'Dimension C-137',
    description: 'Dimensão da localização.',
  })
  dimension: string

  @ApiProperty({
    example: '2017-11-10T12:00:00.000Z',
    description: 'Timestamp de criação.',
  })
  created: string
}
