import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { WeathersService } from './services/weathers.service'
import { Weather, WeatherSchema } from './schemas/weathers.schema'
import { WeathersController } from './controllers/weathers.controller'
import { WeathersRepository } from './repository/weathers.repository'
import { ScheduleModule } from '@nestjs/schedule'
import { InsightsService } from './services/insights.service'
import { Insight, InsightSchema } from './schemas/insights.schemat'
import { InsightsRepository } from './repository/insights.repository'
import { ExportService } from './services/export.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Weather.name, schema: WeatherSchema },
      { name: Insight.name, schema: InsightSchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  providers: [
    WeathersService,
    WeathersRepository,
    InsightsService,
    InsightsRepository,
    ExportService,
  ],
  controllers: [WeathersController],
  exports: [InsightsService],
})
export class WeathersModule {}
