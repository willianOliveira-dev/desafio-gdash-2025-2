import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWeatherDto {
    // city
    @IsNotEmpty({ message: 'O nome da cidade é obrigatório.' })
    @IsString({ message: 'O nome da cidade deve ser uma string.' })
    city: string;

    // country
    @IsNotEmpty({ message: 'O nome do país é obrigatório.' })
    @IsString({ message: 'O nome do país deve ser uma string.' })
    country: string;

    // temperature
    @IsNotEmpty({ message: 'A temperatura é obrigatória.' })
    @IsNumber({}, { message: 'A temperatura deve ser um número.' })
    @Type(() => Number)
    temperature: number;

    // feelsLike
    @IsNotEmpty({ message: 'A sensação térmica é obrigatória.' })
    @IsNumber({}, { message: 'A sensação térmica deve ser um número.' })
    @Type(() => Number)
    feelsLike: number;

    // tempMin
    @IsNotEmpty({ message: 'A temperatura mínima é obrigatória.' })
    @IsNumber({}, { message: 'A temperatura mínima deve ser um número.' })
    @Type(() => Number)
    tempMin: number;

    // tempMax
    @IsNotEmpty({ message: 'A temperatura máxima é obrigatória.' })
    @IsNumber({}, { message: 'A temperatura máxima deve ser um número.' })
    @Type(() => Number)
    tempMax: number;

    // humidity
    @IsNotEmpty({ message: 'A umidade é obrigatória.' })
    @IsNumber({}, { message: 'A umidade deve ser um número.' })
    @Type(() => Number)
    humidity: number;

    // pressure
    @IsNotEmpty({ message: 'A pressão atmosférica é obrigatória.' })
    @IsNumber({}, { message: 'A pressão atmosférica deve ser um número.' })
    @Type(() => Number)
    pressure: number;

    // windSpeed
    @IsNotEmpty({ message: 'A velocidade do vento é obrigatória.' })
    @IsNumber({}, { message: 'A velocidade do vento deve ser um número.' })
    @Type(() => Number)
    windSpeed: number;

    // windDeg
    @IsNotEmpty({ message: 'A direção do vento é obrigatória.' })
    @IsNumber({}, { message: 'A direção do vento deve ser um número.' })
    @Type(() => Number)
    windDeg: number;

    // clouds
    @IsNotEmpty({ message: 'A cobertura de nuvens é obrigatória.' })
    @IsNumber({}, { message: 'A cobertura de nuvens deve ser um número.' })
    @Type(() => Number)
    clouds: number;

    // condition
    @IsNotEmpty({ message: 'A condição climática é obrigatória.' })
    @IsString({ message: 'A condição climática deve ser uma string.' })
    condition: string;

    // sunrise
    @IsNotEmpty({ message: 'O horário do nascer do sol é obrigatório.' })
    @IsString({ message: 'O horário do nascer do sol deve ser uma string.' })
    sunrise: string;

    // sunset
    @IsNotEmpty({ message: 'O horário do pôr do sol é obrigatório.' })
    @IsString({ message: 'O horário do pôr do sol deve ser uma string.' })
    sunset: string;
}
