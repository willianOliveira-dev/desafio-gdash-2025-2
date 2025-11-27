import { FilterQuery, PaginateOptions } from 'mongoose';
import { WeatherDocument } from './weather.interface';

export interface PaginationFilter {
    query?: FilterQuery<WeatherDocument>;
    options?: PaginateOptions;
}
