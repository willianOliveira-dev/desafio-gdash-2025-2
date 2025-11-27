import { Document, PaginateModel, Types } from 'mongoose';
import { Weather } from '../schemas/weathers.schema';

export interface WeatherDocument extends Weather, Document {}

export interface WeatherModelPaginate extends PaginateModel<WeatherDocument> {}

export interface WeatherModel extends Weather {
    _id: Types.ObjectId;
}
export interface WeatherPageResult {
    data: WeatherModel[];
    meta: {
        total: number;
        limit: number;
        page: number | undefined;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
