import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { LoginDto } from '../dto/login.dto'
import { AuthService } from '../services/auth.service'
import { ConfigService } from '@nestjs/config'
import { Env } from 'src/env.validation'
import { Payload } from '../interfaces/payload.interface'
import { GetUserPayload } from 'src/common/decorators/get-user-payload.decorator'
import { UsersService } from 'src/modules/users/services/users.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import type { CookieOptions, Request, Response } from 'express'
import type { ResponseApi } from 'src/common/interfaces/response-api.interface'
import type { UserModelWithoutPassword } from 'src/modules/users/interfaces/users.interface'
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ApiStandardResponse } from 'src/common/swagger/decorators/api-standard-response.decorator'
import { ApiAuth } from 'src/common/swagger/decorators/api-cookies-auth.decorator'
import { UserModelWithoutPasswordSwaggerDto } from 'src/common/swagger/dto/user-model-without-password-swagger.dto'
import { ApiErrorResponseDto } from 'src/common/swagger/dto/api-error-response.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly config: ConfigService<Env>,
  ) {}

  private setCookie(maxAge: number): CookieOptions {
    return {
      httpOnly: true,
      sameSite: this.config.get('COOKIE_SAMESITE') || 'strict',
      secure: this.config.get('NODE_ENV') === 'production',
      path: '/',
      maxAge,
    }
  }

  @Post('login')
  @ApiStandardResponse(null)
  @ApiBadRequestResponse({
    description: 'Senha inválida.',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'O nome de usuário ou e-mail não encontrado.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor.',
    type: ApiErrorResponseDto,
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseApi<null>> {
    const { accessToken, refreshToken } =
      await this.authService.loginAndSetTokens(dto)

    const COOKIE_ACCESS = this.setCookie(
      Number(this.config.get('COOKIE_ACCESS_EXPIRES') || 15 * 60 * 1000),
    )

    const COOKIE_REFRESH = this.setCookie(
      Number(
        this.config.get('COOKIE_REFRESH_EXPIRES') || 7 * 24 * 60 * 60 * 1000,
      ),
    )

    res.cookie('accessToken', accessToken, COOKIE_ACCESS)

    res.cookie('refreshToken', refreshToken, COOKIE_REFRESH)

    return { message: 'Logado.', data: null }
  }

  @Post('refresh')
  @ApiStandardResponse(null)
  @ApiForbiddenResponse({
    description: 'Token de atualização incompatível.',
    type: ApiErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token de atualização inválido.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor.',
    type: ApiErrorResponseDto,
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseApi<null>> {
    const refreshToken = req['cookies']['refreshToken']

    if (!refreshToken) {
      throw new HttpException('Sem token de atualização.', HttpStatus.FORBIDDEN)
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshTokens(refreshToken)

    const COOKIE_ACCESS = this.setCookie(
      Number(this.config.get('COOKIE_ACCESS_EXPIRES') || 15 * 60 * 1000),
    )

    const COOKIE_REFRESH = this.setCookie(
      Number(
        this.config.get('COOKIE_REFRESH_EXPIRES') || 7 * 24 * 60 * 60 * 1000,
      ),
    )

    res.cookie('accessToken', accessToken, COOKIE_ACCESS)

    res.cookie('refreshToken', newRefreshToken, COOKIE_REFRESH)

    return { message: 'Revigorado.', data: null }
  }

  @Post('logout')
  @ApiStandardResponse(null)
  @ApiForbiddenResponse({
    description: 'Sem token de atualização.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor',
    type: ApiErrorResponseDto,
  })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseApi<null>> {
    const refreshToken = req.cookies['refreshToken']

    try {
      const payload: Payload = await this.authService['jwtService'].verifyAsync(
        refreshToken,
        {
          secret: this.config.get('JWT_REFRESH_SECRET'),
        },
      )

      await this.authService.logout(payload.sub.toString())
    } catch (error) {
      throw new HttpException('Sem token de atualização.', HttpStatus.FORBIDDEN)
    }

    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    return { message: 'Sessão encerrada.', data: null }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiAuth()
  @ApiStandardResponse(UserModelWithoutPasswordSwaggerDto)

  @ApiNotFoundResponse({
    description: 'Usuário não encontrado.',
    type: ApiErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor',
    type: ApiErrorResponseDto,
  })
  async me(
    @GetUserPayload('sub') userId: string,
  ): Promise<ResponseApi<UserModelWithoutPassword>> {
    const user = await this.usersService.findOne(userId)
    return { message: 'Usuário autenticado.', data: user }
  }
}
