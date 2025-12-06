import { Workbook } from 'exceljs'
import { Injectable } from '@nestjs/common'
import { WeatherModel } from '../interfaces/weather.interface'

@Injectable()
export class ExportService {
  generateCSV(data: WeatherModel[]): string {
    const headers = [
      'city',
      'country',
      'temperature',
      'feelsLike',
      'tempMin',
      'tempMax',
      'humidity',
      'pressure',
      'windSpeed',
      'windDeg',
      'clouds',
      'condition',
      'sunrise',
      'sunset',
      'currentTime',
      'createdAt',
    ]

    const rows = data.map((item) =>
      headers
        .map((field) => {
          const value = item[field]
          return value !== undefined && value !== null
            ? `"${String(value).replace(/"/g, '""')}"`
            : '""'
        })
        .join(','),
    )

    return [headers.join(','), ...rows].join('\n')
  }

  generateXLSX(data: WeatherModel[]) {
    const workbook = new Workbook()
    const sheet = workbook.addWorksheet('Weather Logs')

    sheet.columns = [
      { header: 'City', key: 'city', width: 20 },
      { header: 'Country', key: 'country', width: 12 },
      { header: 'Temperature', key: 'temperature', width: 15 },
      { header: 'Feels Like', key: 'feelsLike', width: 15 },
      { header: 'Temp Min', key: 'tempMin', width: 15 },
      { header: 'Temp Max', key: 'tempMax', width: 15 },
      { header: 'Humidity', key: 'humidity', width: 15 },
      { header: 'Pressure', key: 'pressure', width: 15 },
      { header: 'Wind Speed', key: 'windSpeed', width: 15 },
      { header: 'Wind Deg', key: 'windDeg', width: 15 },
      { header: 'Clouds', key: 'clouds', width: 15 },
      { header: 'Condition', key: 'condition', width: 20 },
      { header: 'Sunrise', key: 'sunrise', width: 15 },
      { header: 'Sunset', key: 'sunset', width: 15 },
      { header: 'Current Time', key: 'currentTime', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ]

    data.forEach((item) => sheet.addRow(item))
    return workbook.xlsx.writeBuffer()
  }
}
