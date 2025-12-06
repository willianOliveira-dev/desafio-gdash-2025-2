import { ApiProperty } from '@nestjs/swagger'
import { WeatherModelSwaggerDto } from './weather-model-swagger.dto'

class WeatherMetaSwaggerDto {
  @ApiProperty({
    example: 42,
    description: 'Número total de registros de clima.',
  })
  total: number

  @ApiProperty({ example: 10, description: 'Limite de itens por página.' })
  limit: number

  @ApiProperty({ example: 1, description: 'Número da página atual.' })
  page: number | undefined

  @ApiProperty({ example: 5, description: 'Total de páginas disponíveis.' })
  totalPages: number

  @ApiProperty({
    example: true,
    description: 'Indica se existe uma próxima página de resultados.',
  })
  hasNext: boolean

  @ApiProperty({
    example: false,
    description: 'Indica se existe uma página anterior de resultados.',
  })
  hasPrev: boolean
}

export class WeatherPageResultSwaggerDto {
  @ApiProperty({
    type: [WeatherModelSwaggerDto],
    isArray: true,
    description: 'Lista de registros de clima na página atual.',
    example: [
      {
        city: 'Rio de Janeiro',
        country: 'BR',
        temperature: 28.5,
        feelsLike: 30,
        tempMin: 25,
        tempMax: 32,
        humidity: 70,
        pressure: 1010,
        windSpeed: 4.5,
        windDeg: 120,
        clouds: 20,
        condition: 'broken clouds',
        sunrise: '2025-12-06T10:56:34.000',
        sunset: '2025-12-06T10:56:34.000',
        currentTime: '2025-12-06T10:56:34.000',
      },
    ],
  })
  data: WeatherModelSwaggerDto[]

  @ApiProperty({
    type: WeatherMetaSwaggerDto,
    description: 'Metadados da paginação.',
  })
  meta: WeatherMetaSwaggerDto
}
