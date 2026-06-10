import { Controller, Get, ServiceUnavailableException } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import {
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger'
import type { Connection } from 'mongoose'
import type { ResponseApi } from 'src/common/interfaces/response-api.interface'

interface HealthData {
  status: 'ok'
  database: 'connected'
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  @ApiOkResponse({ description: 'API e MongoDB disponiveis.' })
  @ApiServiceUnavailableResponse({ description: 'MongoDB indisponivel.' })
  getHealth(): ResponseApi<HealthData> {
    if (this.connection.readyState !== 1) {
      throw new ServiceUnavailableException('Banco de dados indisponivel.')
    }

    return {
      message: 'Servico disponivel.',
      data: {
        status: 'ok',
        database: 'connected',
      },
    }
  }
}
