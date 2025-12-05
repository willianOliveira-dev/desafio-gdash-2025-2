import { Injectable } from '@nestjs/common'
import { GetWeathersDto } from '../dto/get-weather.dto'
import { WeathersRepository } from '../repository/weathers.repository'
import type {
  WeatherModel,
  WeatherPageResult,
} from '../interfaces/weather.interface'
import { CreateWeatherDto } from '../dto/create-weather.dto'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class WeathersService {
  constructor(private readonly repo: WeathersRepository) {}

  async getPaginatedWeathers(dto: GetWeathersDto): Promise<WeatherPageResult> {
    const limit = dto.limit ?? 20
    const offset = dto.offset ?? 0
    const page = Math.floor(offset / limit) + 1

    const filter: any = {}

    if (dto.city) {
      filter.city = { $regex: new RegExp(dto.city, 'i') }
    }

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      select: '-__v',
      lean: true,
      exec: true,
    }

    const result = await this.repo.paginate({ query: filter, options })

    const weathers: WeatherModel[] = result.docs.map((weather) => ({
      _id: weather._id,
      city: weather.city,
      country: weather.country,
      temperature: weather.temperature,
      feelsLike: weather.feelsLike,
      tempMin: weather.tempMin,
      tempMax: weather.tempMax,
      humidity: weather.humidity,
      pressure: weather.pressure,
      windSpeed: weather.windSpeed,
      windDeg: weather.windDeg,
      clouds: weather.clouds,
      condition: weather.condition,
      sunrise: weather.sunrise,
      sunset: weather.sunset,
      currentTime: weather.currentTime
    }))

    return {
      data: weathers,
      meta: {
        total: result.totalDocs,
        limit: result.limit,
        page: result.page,
        totalPages: result.totalPages,
        hasNext: result.hasNextPage,
        hasPrev: result.hasPrevPage,
      },
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async getTodayWeatherRecord(): Promise<WeatherModel[]> {
    const now = new Date()
    const day = now.getDate()
    const month = now.getMonth()
    const year = now.getFullYear()

    const startDate = new Date(year, month, day, 0, 0, 0, 0)
    const endDate = now

    return this.repo.getTodayWeatherRecords(startDate, endDate)
  }

  async create(dto: CreateWeatherDto): Promise<WeatherModel> {
    return this.repo.create(dto)
  }
}
