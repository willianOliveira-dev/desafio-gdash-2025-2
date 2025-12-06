import { IsString, IsNotEmpty, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class CreateWeatherDto {
  @ApiProperty({ example: 'Rio de Janeiro', description: 'Nome da cidade.' })
  @IsNotEmpty({ message: 'O nome da cidade é obrigatório.' })
  @IsString({ message: 'O nome da cidade deve ser uma string.' })
  city: string

  @ApiProperty({
    example: 'BR',
    description: 'Código do país BR.',
  })
  @IsNotEmpty({ message: 'O nome do país é obrigatório.' })
  @IsString({ message: 'O nome do país deve ser uma string.' })
  country: string

  @ApiProperty({ example: 28.5, description: 'Temperatura atual em Celsius.' })
  @IsNotEmpty({ message: 'A temperatura é obrigatória.' })
  @IsNumber({}, { message: 'A temperatura deve ser um número.' })
  @Type(() => Number)
  temperature: number

  @ApiProperty({ example: 30.0, description: 'Sensação térmica.' })
  @IsNotEmpty({ message: 'A sensação térmica é obrigatória.' })
  @IsNumber({}, { message: 'A sensação térmica deve ser um número.' })
  @Type(() => Number)
  feelsLike: number

  @ApiProperty({ example: 25.0, description: 'Temperatura mínima prevista.' })
  @IsNotEmpty({ message: 'A temperatura mínima é obrigatória.' })
  @IsNumber({}, { message: 'A temperatura mínima deve ser um número.' })
  @Type(() => Number)
  tempMin: number

  @ApiProperty({ example: 32.0, description: 'Temperatura máxima prevista.' })
  @IsNotEmpty({ message: 'A temperatura máxima é obrigatória.' })
  @IsNumber({}, { message: 'A temperatura máxima deve ser um número.' })
  @Type(() => Number)
  tempMax: number

  @ApiProperty({
    example: 70,
    description: 'Umidade do ar em percentual (0-100).',
  })
  @IsNotEmpty({ message: 'A umidade é obrigatória.' })
  @IsNumber({}, { message: 'A umidade deve ser um número.' })
  @Type(() => Number)
  humidity: number

  @ApiProperty({ example: 1010, description: 'Pressão atmosférica em hPa.' })
  @IsNotEmpty({ message: 'A pressão atmosférica é obrigatória.' })
  @IsNumber({}, { message: 'A pressão atmosférica deve ser um número.' })
  @Type(() => Number)
  pressure: number

  @ApiProperty({ example: 4.5, description: 'Velocidade do vento em m/s.' })
  @IsNotEmpty({ message: 'A velocidade do vento é obrigatória.' })
  @IsNumber({}, { message: 'A velocidade do vento deve ser um número.' })
  @Type(() => Number)
  windSpeed: number

  @ApiProperty({
    example: 120,
    description: 'Direção do vento em graus (0-360).',
  })
  @IsNotEmpty({ message: 'A direção do vento é obrigatória.' })
  @IsNumber({}, { message: 'A direção do vento deve ser um número.' })
  @Type(() => Number)
  windDeg: number

  @ApiProperty({
    example: 20,
    description: 'Porcentagem de cobertura de nuvens.',
  })
  @IsNotEmpty({ message: 'A cobertura de nuvens é obrigatória.' })
  @IsNumber({}, { message: 'A cobertura de nuvens deve ser um número.' })
  @Type(() => Number)
  clouds: number

  @ApiProperty({
    example: 'broken clouds',
    description: 'Descrição da condição climática.',
  })
  @IsNotEmpty({ message: 'A condição climática é obrigatória.' })
  @IsString({ message: 'A condição climática deve ser uma string.' })
  condition: string

  @ApiProperty({
    example: '2025-12-06T10:56:34.000',
    description: 'Hora do nascer do sol (string) sem timezone.',
  })
  @IsNotEmpty({ message: 'O horário do nascer do sol é obrigatório.' })
  @IsString({ message: 'O horário do nascer do sol deve ser uma string.' })
  sunrise: string
  @ApiProperty({
    example: '2025-12-06T10:56:34.000',
    description: 'Hora do pôr do sol (string) sem timezone.',
  })
  @IsNotEmpty({ message: 'O horário do pôr do sol é obrigatório.' })
  @IsString({ message: 'O horário do pôr do sol deve ser uma string.' })
  sunset: string

  @ApiProperty({
    example: '2025-12-06T10:56:34.000',
    description:
      'Hora atual em que os dados foram coletados (string) sem timezone..',
  })
  @IsNotEmpty({ message: 'O horário atual é obrigatório.' })
  @IsString({ message: 'O horário atual deve ser uma string.' })
  currentTime: string
}
