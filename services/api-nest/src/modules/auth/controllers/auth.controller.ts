import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env.validation';
import { Payload } from '../interfaces/payload.interface';
import type { CookieOptions, Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly config: ConfigService<Env>
    ) {}

    private setCookie(maxAge: number): CookieOptions {
        return {
            httpOnly: true,
            sameSite: this.config.get('COOKIE_SAMESITE') || 'strict',
            secure: this.config.get('NODE_ENV') === 'production',
            path: '/',
            maxAge,
        };
    }

    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const { accessToken, refreshToken } =
            await this.authService.loginAndSetTokens(dto);

        const COOKIE_ACCESS = this.setCookie(
            Number(this.config.get('COOKIE_ACCESS_EXPIRES') || 15 * 60 * 1000)
        );

        const COOKIE_REFRESH = this.setCookie(
            Number(
                this.config.get('COOKIE_REFRESH_EXPIRES') ||
                    7 * 24 * 60 * 60 * 1000
            )
        );

        res.cookie('accessToken', accessToken, COOKIE_ACCESS);

        res.cookie('refreshToken', refreshToken, COOKIE_REFRESH);

        return { message: 'Logado.', data: null };
    }

    @Post('refresh')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        const refreshToken = req['cookies']['refreshToken'];

        if (!refreshToken) {
            throw new HttpException(
                'Sem token de atualização.',
                HttpStatus.FORBIDDEN
            );
        }

        const { accessToken, refreshToken: newRefreshToken } =
            await this.authService.refreshTokens(refreshToken);

        const COOKIE_ACCESS = this.setCookie(
            Number(this.config.get('JWT_ACCESS_EXPIRES') || 15 * 60 * 1000)
        );

        const COOKIE_REFRESH = this.setCookie(
            Number(
                this.config.get('JWT_REFRESH_EXPIRES') ||
                    7 * 24 * 60 * 60 * 1000
            )
        );

        res.cookie('accessToken', accessToken, COOKIE_ACCESS);

        res.cookie('refreshToken', newRefreshToken, COOKIE_REFRESH);

        return { message: 'Revigorado.', data: null };
    }

    @Post('logout')
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        const refreshToken = req.cookies['refreshToken'];

        try {
            const payload: Payload = await this.authService[
                'jwtService'
            ].verifyAsync(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });

            await this.authService.logout(payload.sub.toString());
        } catch (error) {
            throw new HttpException(
                'Error interno no servidor',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return { message: 'Sessão encerrada.', data: null };
    }
}
