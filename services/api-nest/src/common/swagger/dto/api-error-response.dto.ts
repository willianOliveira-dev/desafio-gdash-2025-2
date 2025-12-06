import { ApiProperty } from '@nestjs/swagger'

export class ApiErrorResponseDto {
  @ApiProperty({
    examples: [400, 401, 403, 404, 500],
    description: 'Código de status HTTP da falha.',
  })
  statusCode: number

  @ApiProperty({
    example: false,
    description:
      'Indica que a operação NÃO foi bem-sucedida (sempre false em caso de erro).',
  })
  success: boolean = false

  @ApiProperty({
    example: 'Bad Request',
    description:
      'O nome do erro HTTP ou da exceção (Ex: Unauthorized, NotFoundException, Bad Request).',
  })
  error: string

  @ApiProperty({
    example: 'O nome de usuário é obrigatório.',
    description:
      'Mensagem detalhada sobre o erro (Ex: requisição mal feita, recurso não encontrado).',
  })
  message: string

  @ApiProperty({
    example: '2025-12-06T10:56:34.000Z',
    description: 'Timestamp no formato ISO 8601.',
  })
  timestamp: string

  @ApiProperty({
    example: '/api/v1/users',
    description: 'O caminho (path) da requisição que gerou o erro.',
  })
  path: string
}
