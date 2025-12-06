import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose'
import * as moongosePaginate from 'mongoose-paginate-v2'

@Schema({
  timestamps: true,
})
export class Weather {
  @Prop({
    type: String,
    required: true,
  })
  city: string

  @Prop({
    type: String,
    required: true,
  })
  country: string

  @Prop({
    type: Number,
    required: true,
  })
  temperature: number

  @Prop({
    type: Number,
    required: true,
  })
  feelsLike: number

  @Prop({
    type: Number,
    required: true,
  })
  tempMin: number

  @Prop({
    type: Number,
    required: true,
  })
  tempMax: number

  @Prop({
    type: Number,
    required: true,
  })
  humidity: number

  @Prop({
    type: Number,
    required: true,
  })
  pressure: number

  @Prop({
    type: Number,
    required: true,
  })
  windSpeed: number

  @Prop({
    type: Number,
    required: true,
  })
  windDeg: number

  @Prop({
    type: Number,
    required: true,
  })
  clouds: number

  @Prop({
    type: String,
    required: true,
  })
  condition: string

  @Prop({
    type: String,
    required: true,
  })
  sunrise: string

  @Prop({
    type: String,
    required: true,
  })
  sunset: string

  @Prop({
    type: String,
    required: true,
  })
  currentTime: string
}

export const WeatherSchema = SchemaFactory.createForClass(Weather)

WeatherSchema.plugin(moongosePaginate.default)
