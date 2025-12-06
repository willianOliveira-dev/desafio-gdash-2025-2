import { ApiProperty } from '@nestjs/swagger'
import { CharacterModelSwaggerDto } from './character-model-swagger.dto'

class CharacterPaginationSwaggerInfo {
  @ApiProperty({ example: 826, description: 'Total de registros disponíveis.' })
  count: number

  @ApiProperty({ example: 42, description: 'Total de páginas.' })
  pages: number

  @ApiProperty({
    example: 2,
    description: 'Número da próxima página (null se for a última).',
  })
  next: number | null

  @ApiProperty({
    example: null,
    description: 'Número da página anterior (null se for a primeira).',
  })
  prev: number | null
}

export class CharacterPaginationSwaggerDto {
  @ApiProperty({
    type: CharacterPaginationSwaggerInfo,
    description: 'Metadados da paginação.',
  })
  info: CharacterPaginationSwaggerInfo

  @ApiProperty({
    type: [CharacterModelSwaggerDto],
    isArray: true,
    description: 'Lista de personagens na página atual.',
    example: [
      {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        image: 'url',
        created: '2017-11-10T12:00:00.000Z',
      },
    ],
  })
  results: CharacterModelSwaggerDto[]
}
