import { InjectModel } from '@nestjs/mongoose';
import { Weather } from '../schemas/weathers.schema';
import { PaginateResult } from 'mongoose';
import { CreateWeatherDto } from '../dto/create-weather.dto';
import { Injectable } from '@nestjs/common';
import type {
    WeatherModelPaginate,
    WeatherModel,
    WeatherDocument,
} from '../interfaces/weather.interface';
import type { PaginationFilter } from '../interfaces/paginatio-filter.interface';

@Injectable()
export class WeathersRepository {
    constructor(
        @InjectModel(Weather.name)
        private readonly weatherModel: WeatherModelPaginate
    ) {}

    async paginate({
        query,
        options,
    }: PaginationFilter): Promise<PaginateResult<WeatherDocument>> {
        return this.weatherModel.paginate(query, options);
    }

    async create(dto: CreateWeatherDto): Promise<WeatherModel> {
        const createdWeather = new this.weatherModel(dto);
        const savedWeather = await createdWeather.save();
        const { __v, ...weather } = savedWeather.toObject();
        return weather;
    }
}
