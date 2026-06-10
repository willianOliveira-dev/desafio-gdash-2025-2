import { Module, type OnModuleInit } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { type Env, validateEnv } from 'src/env.validation'
import { AuthModule } from 'src/modules/auth/auth.module'
import { AvatarsModule } from 'src/modules/avatars/avatars.module'
import { ExploreModule } from 'src/modules/explore/explore.module'
import { HealthModule } from 'src/modules/health/health.module'
import { UsersModule } from 'src/modules/users/users.module'
import { WeathersModule } from 'src/modules/weathers/weathers.module'
import { InsightsSeeder } from './seed/insights.seeder'
import { UserSeeder } from './seed/user.seeder'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env>) => ({
        uri: config.get('MONGO_URI', { infer: true }),
      }),
    }),
    AuthModule,
    UsersModule,
    AvatarsModule,
    WeathersModule,
    ExploreModule,
    HealthModule,
  ],
  controllers: [],
  providers: [UserSeeder, InsightsSeeder],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly insightsSeeder: InsightsSeeder,
  ) {}

  async onModuleInit() {
    await this.userSeeder.seed()
    await this.insightsSeeder.seed()
  }
}
