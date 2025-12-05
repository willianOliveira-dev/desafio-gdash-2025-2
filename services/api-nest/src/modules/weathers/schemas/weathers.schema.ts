import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose'
import * as moongosePaginate from 'mongoose-paginate-v2'

@Schema({
  timestamps: true,
})
export class Weather {
  // city
  @Prop({
    type: String,
    required: true,
  })
  city: string

  // country
  @Prop({
    type: String,
    required: true,
  })
  country: string

  // temperature
  @Prop({
    type: Number,
    required: true,
  })
  temperature: number

  // feelsLike
  @Prop({
    type: Number,
    required: true,
  })
  feelsLike: number

  // tempMin
  @Prop({
    type: Number,
    required: true,
  })
  tempMin: number

  //tempMax
  @Prop({
    type: Number,
    required: true,
  })
  tempMax: number

  // humidity
  @Prop({
    type: Number,
    required: true,
  })
  humidity: number

  // pressure
  @Prop({
    type: Number,
    required: true,
  })
  pressure: number

  // windSpeed
  @Prop({
    type: Number,
    required: true,
  })
  windSpeed: number

  // windDeg
  @Prop({
    type: Number,
    required: true,
  })
  windDeg: number

  // clouds
  @Prop({
    type: Number,
    required: true,
  })
  clouds: number

  //condition
  @Prop({
    type: String,
    required: true,
  })
  condition: string

  // sunrise
  @Prop({
    type: String,
    required: true,
  })
  sunrise: string

  // sunset
  @Prop({
    type: String,
    required: true,
  })
  sunset: string
  // currentTime
  @Prop({
    type: String,
    required: true,
  })
   currentTime: string
}

export const WeatherSchema = SchemaFactory.createForClass(Weather)

WeatherSchema.plugin(moongosePaginate.default)
