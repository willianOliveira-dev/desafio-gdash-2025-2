import { IsString, IsNumber, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class WeatherModelSwaggerDto {
  @ApiProperty({ example: 'Rio de Janeiro', description: 'Nome da cidade.' })
  @IsNotEmpty()
  @IsString({ message: 'A cidade deve ser uma string.' })
  city: string

  @ApiProperty({
    example: 'BR',
    description: 'Código do país (Ex: BR, US, etc.).',
  })
  @IsNotEmpty()
  @IsString({ message: 'O país deve ser uma string.' })
  country: string

  @ApiProperty({ example: 25.5, description: 'Temperatura atual em Celsius.' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'A temperatura deve ser um número.' })
  temperature: number

  @ApiProperty({
    example: 28.0,
    description: 'Temperatura de sensação térmica.',
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'A sensação térmica deve ser um número.' })
  feelsLike: number

  @ApiProperty({ example: 23.0, description: 'Temperatura mínima prevista.' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'A temperatura mínima deve ser um número.' })
  tempMin: number

  @ApiProperty({ example: 30.5, description: 'Temperatura máxima prevista.' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'A temperatura máxima deve ser um número.' })
  tempMax: number

  @ApiProperty({
    example: 75,
    description: 'Umidade do ar em percentual (0-100).',
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'A umidade deve ser um número.' })
  humidity: number

  @ApiProperty({ example: 1012, description: 'Pressão atmosférica em hPa.' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'A pressão deve ser um número.' })
  pressure: number

  @ApiProperty({ example: 5.2, description: 'Velocidade do vento em m/s.' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'A velocidade do vento deve ser um número.' })
  windSpeed: number

  @ApiProperty({
    example: 180,
    description: 'Direção do vento em graus (0-360).',
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'A direção do vento deve ser um número.' })
  windDeg: number

  @ApiProperty({
    example: 40,
    description: 'Porcentagem de cobertura de nuvens.',
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'A cobertura de nuvens deve ser um número.' })
  clouds: number

  @ApiProperty({
    example: 'broken clouds',
    description: 'Descrição da condição climática.',
  })
  @IsNotEmpty()
  @IsString({ message: 'A condição deve ser uma string.' })
  condition: string

  @ApiProperty({
    example: '2025-12-06T10:56:34.000',
    description:
      'Hora do nascer do sol (formatada como timestamp sem timezone.).',
  })
  @IsNotEmpty()
  @IsString({ message: 'O nascer do sol deve ser uma string.' })
  sunrise: string

  @ApiProperty({
    example: '2025-12-06T10:56:34.000',
    description: 'Hora do pôr do sol (formatada como timestamp sem timezone.).',
  })
  @IsNotEmpty()
  @IsString({ message: 'O pôr do sol deve ser uma string.' })
  sunset: string

  @ApiProperty({
    example: '2025-12-06T10:56:34.000',
    description:
      'Hora atual em que os dados foram coletados (formatada como timestamp sem timezone.).',
  })
  @IsNotEmpty()
  @IsString({ message: 'A hora atual deve ser uma string.' })
  currentTime: string
}
