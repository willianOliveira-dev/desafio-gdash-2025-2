import { ApiProperty } from '@nestjs/swagger'
import { LocationModelSwaggerDto } from './location-model-swagger.dto'

export class CharacterModelSwaggerDto {
  @ApiProperty({ example: 1, description: 'ID do personagem.' })
  id: number

  @ApiProperty({ example: 'Rick Sanchez', description: 'Nome do personagem.' })
  name: string

  @ApiProperty({
    example: 'Alive',
    enum: ['Alive', 'Dead', 'unknown'],
    description: 'Status de vida do personagem.',
  })
  status: 'Alive' | 'Dead' | 'unknown'

  @ApiProperty({ example: 'Human', description: 'Espécie do personagem.' })
  species: string

  @ApiProperty({
    example: '',
    description: 'Tipo ou subtipo do personagem (pode ser vazio).',
  })
  type: string

  @ApiProperty({
    example: 'Male',
    enum: ['Female', 'Male', 'Genderless', 'unknown'],
    description: 'Gênero do personagem.',
  })
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown'

  @ApiProperty({
    type: LocationModelSwaggerDto,
    description: 'Origem do personagem.',
  })
  origin: LocationModelSwaggerDto

  @ApiProperty({
    type: LocationModelSwaggerDto,
    description: 'Localização atual do personagem.',
  })
  location: LocationModelSwaggerDto

  @ApiProperty({
    example: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    description: 'URL da imagem do personagem.',
  })
  image: string

  @ApiProperty({
    example: '2017-11-10T12:00:00.000Z',
    description: 'Timestamp de criação.',
  })
  created: string
}
