import { ApiProperty } from '@nestjs/swagger'

export class SwaggerResponseModel<T = unknown> {
  // statusCode
  @ApiProperty({
    example: 200,
    description: 'Código de status HTTP da resposta.',
  })
  statusCode: number

  // success
  @ApiProperty({
    example: true,
    description: 'Indica se a operação foi bem-sucedida (boolean).',
  })
  success: boolean

  // message
  @ApiProperty({
    example: 'Operação realizada com sucesso.',
    description: 'Mensagem descritiva sobre o resultado da operação.',
  })
  message: string

  //data
  @ApiProperty({
    description:
      'Os dados retornados pela operação. Pode ser um objeto, array, ou nulo.',
    nullable: true,
  })
  data: T | null

  // timestamp
  @ApiProperty({
    example: '2025-12-06T10:56:34.000Z',
    description: 'Timestamp da resposta no formato ISO 8601.',
  })
  timestamp: string

  // path
  @ApiProperty({
    example: '/api/v1/gdash',
    description: 'O caminho (path) da requisição que gerou esta resposta.',
  })
  path: string
}
