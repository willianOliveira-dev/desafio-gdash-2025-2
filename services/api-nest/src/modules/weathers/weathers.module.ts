import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeathersService } from './services/weathers.service';
import { Weather, WeatherSchema } from './schemas/weathers.schema';
import { WeathersController } from './controllers/weathers.controller';
import { WeathersRepository } from './repository/weathers.repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Weather.name, schema: WeatherSchema },
        ]),
    ],
    providers: [WeathersService, WeathersRepository],
    controllers: [WeathersController],
})
export class WeathersModule {}
