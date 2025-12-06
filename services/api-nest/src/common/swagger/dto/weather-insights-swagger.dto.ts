import { ApiProperty } from '@nestjs/swagger'

export class WeatherInsightsSwaggerDto {
  @ApiProperty({
    example: 'Risco de Chuva Forte',
    description: 'Título breve do insight.',
  })
  title: string

  @ApiProperty({
    example:
      'Há 70% de chance de chuvas intensas nas próximas 3 horas, causando alagamentos.',
    description: 'Descrição detalhada do insight ou observação.',
  })
  description: string

  @ApiProperty({
    example: 'cloud-lightning',
    description: 'Nome do ícone ou identificador (Ex: FontAwesome, URL, etc.).',
  })
  icon: string

  @ApiProperty({
    example: 'alert',
    enum: ['alert', 'trend', 'comfort', 'summary'],
    description: 'Categoria ou tipo do insight.',
  })
  type: 'alert' | 'trend' | 'comfort' | 'summary'
}
