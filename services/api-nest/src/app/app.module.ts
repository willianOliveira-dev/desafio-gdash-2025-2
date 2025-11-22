import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { validateEnv, Env } from 'src/env.validation';
import { UsersModule } from 'src/modules/users/users.module';

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
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
