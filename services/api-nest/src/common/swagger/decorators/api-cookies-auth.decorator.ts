import { applyDecorators } from '@nestjs/common'
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'

export function ApiAuth() {
  return applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiUnauthorizedResponse({
      description: 'Usuário não autenticado',
    }),
  )
}
