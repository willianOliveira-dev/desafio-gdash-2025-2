import { Body, Controller, HttpCode, Query } from '@nestjs/common';
import { WeathersService } from '../services/weathers.service';
import { Get, Post } from '@nestjs/common';
import { GetWeathersDto } from '../dto/get-weather.dto';
import { CreateWeatherDto } from '../dto/create-weather.dto';

@Controller('weather')
export class WeathersController {
    constructor(private readonly weathersService: WeathersService) {}

    @Get('logs')
    async getPaginatedWeathers(@Query() query: GetWeathersDto) {
        const weathers = await this.weathersService.getPaginatedWeathers(query);
        return {
            message: 'Dados climáticos encontrados com sucesso.',
            data: weathers,
        };
    }

    @Post('logs')
    @HttpCode(201)
    async createWeather(@Body() dto: CreateWeatherDto) {
        const weather = await this.weathersService.create(dto);
        return {
            message: 'Registro de clima criado com sucesso.',
            data: weather,
        };
    }
}
