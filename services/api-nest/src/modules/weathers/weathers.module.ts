import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'
import { WorkerAuthGuard } from 'src/common/guards/worker-auth.guard'
import { WeathersController } from './controllers/weathers.controller'
import { InsightsRepository } from './repository/insights.repository'
import { WeathersRepository } from './repository/weathers.repository'
import { Insight, InsightSchema } from './schemas/insights.schemat'
import { Weather, WeatherSchema } from './schemas/weathers.schema'
import { ExportService } from './services/export.service'
import { InsightsService } from './services/insights.service'
import { WeathersService } from './services/weathers.service'

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
    WorkerAuthGuard,
  ],
  controllers: [WeathersController],
  exports: [InsightsService],
})
export class WeathersModule {}
