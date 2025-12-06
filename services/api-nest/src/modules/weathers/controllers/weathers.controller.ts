import { Body, Controller, Header, Query, Res, UseGuards } from '@nestjs/common'
import { WeathersService } from '../services/weathers.service'
import { Get, Post } from '@nestjs/common'
import { GetWeathersDto } from '../dto/get-weather.dto'
import { CreateWeatherDto } from '../dto/create-weather.dto'
import { InsightsService } from '../services/insights.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { ExportService } from '../services/export.service'
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ApiStandardResponse } from 'src/common/swagger/decorators/api-standard-response.decorator'
import { ApiAuth } from 'src/common/swagger/decorators/api-cookies-auth.decorator'
import { WeatherModelSwaggerDto } from 'src/common/swagger/dto/weather-model-swagger.dto'
import { WeatherPageResultSwaggerDto } from 'src/common/swagger/dto/weather-page-result-swagger.dto'
import { WeatherInsightsSwaggerDto } from 'src/common/swagger/dto/weather-insights-swagger.dto'
import { ApiErrorResponseDto } from 'src/common/swagger/dto/api-error-response.dto'
import type { WeatherInsights } from '../interfaces/insights.interface'
import { type Response } from 'express'
import type { ResponseApi } from 'src/common/interfaces/response-api.interface'
import type {
  WeatherModel,
  WeatherPageResult,
} from '../interfaces/weather.interface'

@ApiTags('Weather')
@Controller('weather')
export class WeathersController {
  constructor(
    private readonly weathersService: WeathersService,
    private readonly insightsService: InsightsService,
    private readonly exportService: ExportService,
  ) {}
  @Get('logs')
  @ApiStandardResponse(WeatherPageResultSwaggerDto)
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor.',
    type: ApiErrorResponseDto,
  })
  @ApiAuth()
  @UseGuards(JwtAuthGuard)
  async getPaginatedWeathers(
    @Query() query: GetWeathersDto,
  ): Promise<ResponseApi<WeatherPageResult>> {
    const weathers = await this.weathersService.getPaginatedWeathers(query)
    return {
      message: 'Dados climáticos encontrados com sucesso.',
      data: weathers,
    }
  }

  @Post('logs')
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor.',
    type: ApiErrorResponseDto,
  })
  @ApiStandardResponse(WeatherModelSwaggerDto, false, 201)
  @ApiAuth()
  async createWeather(
    @Body() dto: CreateWeatherDto,
  ): Promise<ResponseApi<WeatherModel>> {
    const weather = await this.weathersService.create(dto)
    return {
      message: 'Registro de clima criado com sucesso.',
      data: weather,
    }
  }

  @Get('today')
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor.',
    type: ApiErrorResponseDto,
  })
  @ApiStandardResponse(WeatherModelSwaggerDto, true)
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    type: ApiErrorResponseDto,
  })
  @ApiAuth()
  @UseGuards(JwtAuthGuard)
  async getTodayWeatherRecord(): Promise<ResponseApi<WeatherModel[]>> {
    const weathers = await this.weathersService.getTodayWeatherRecord()

    return {
      message: 'Dados climáticos de hoje encontrados com sucesso.',
      data: weathers,
    }
  }

  @Get('insights')
  @ApiNotFoundResponse({
    description: 'Insigths não encontrados.',
    type: ApiErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Houve um problema ao buscar insights.',
    type: ApiErrorResponseDto,
  })
  @ApiStandardResponse(WeatherInsightsSwaggerDto, true)
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    type: ApiErrorResponseDto,
  })
  @ApiAuth()
  @UseGuards(JwtAuthGuard)
  async getWeatherInsights(): Promise<ResponseApi<WeatherInsights[]>> {
    const weatherInsights = await this.insightsService.getLastestInsights()
    return {
      message: 'Insights climáticos encontrados com sucesso.',
      data: weatherInsights,
    }
  }

  @Get('export.csv')
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor.',
    type: ApiErrorResponseDto,
  })
  @ApiAuth()
  @UseGuards(JwtAuthGuard)
  async exportCSV(@Res() res: Response) {
    const data = await this.weathersService.findAll()
    const csv = this.exportService.generateCSV(data)
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=weather.csv')
    return res.send(csv)
  }

  @Get('export.xlsx')
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor.',
    type: ApiErrorResponseDto,
  })
  @ApiAuth()
  @UseGuards(JwtAuthGuard)
  async exportXLXS(@Res() res: Response) {
    const data = await this.weathersService.findAll()
    const buffer = await this.exportService.generateXLSX(data)

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )

    res.setHeader('Content-Disposition', 'attachment; filename=weather.xlsx')

    return res.end(buffer)
  }
}
