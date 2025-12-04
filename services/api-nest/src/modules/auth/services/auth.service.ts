import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Env } from 'src/env.validation'
import { UsersService } from 'src/modules/users/services/users.service'
import { compare, hash, genSalt } from 'bcrypt'
import { LoginDto } from '../dto/login.dto'
import type { Payload } from '../interfaces/payload.interface'
import type {
  UserModelWithoutPassword,
  UserModel,
} from 'src/modules/users/interfaces/users.interface'
import type { Tokens } from '../interfaces/tokens.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService<Env>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateTokens(payload: Payload): Promise<Tokens> {
    try {
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: Number(this.config.get('JWT_ACCESS_EXPIRES')),
      })

      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: Number(this.config.get('JWT_REFRESH_EXPIRES')),
      })

      return { accessToken, refreshToken }
    } catch (error) {
      throw new HttpException(
        'Error interno no servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  private async validateUser(
    usernameOrEmail: string,
    password: string,
  ): Promise<UserModelWithoutPassword | never> {
    let user: UserModel | null

    if (usernameOrEmail.includes('@')) {
      user = await this.usersService.findByEmailWithPassword(usernameOrEmail)
    } else {
      user = await this.usersService.findByUsernameWithPassword(usernameOrEmail)
    }

    if (user == null)
      throw new HttpException(
        'O nome de usuário ou e-mail não encontrado.',
        HttpStatus.NOT_FOUND,
      )

    const passwordMatches = await compare(password, user.password)

    if (!passwordMatches)
      throw new HttpException('Senha inválida.', HttpStatus.BAD_REQUEST)

    const { password: pw, ...userWithoutPassowrd } = user

    return userWithoutPassowrd
  }

  private async hashToken(token: string): Promise<string> {
    const salt = await genSalt(10)
    const hashed = await hash(token, salt)
    return hashed
  }

  async loginAndSetTokens(dto: LoginDto): Promise<Tokens> {
    const user = await this.validateUser(dto.usernameOrEmail, dto.password)

    const payload: Payload = {
      sub: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    }

    const { accessToken, refreshToken } = await this.generateTokens(payload)

    const refreshTokenHashed = await this.hashToken(refreshToken)

    await this.usersService.setCurrentRefreshToken(
      refreshTokenHashed,
      user._id.toString(),
    )

    return { accessToken, refreshToken }
  }

  async refreshTokens(refreshTokenFromCookie: string): Promise<Tokens> {
    try {
      const payload = await this.jwtService.verifyAsync(
        refreshTokenFromCookie,
        {
          secret: this.config.get('JWT_REFRESH_SECRET'),
        },
      )

      const user = await this.usersService.findOneWithRefreshToken(payload.sub.toString())

      const tokenMatches = await compare(
        refreshTokenFromCookie,
        user.currentHashedRefreshToken || '',
      )
      if (!tokenMatches)
        throw new HttpException(
          'Token de atualização incompatível.',
          HttpStatus.FORBIDDEN,
        )

      const cleanPayload: Payload = {
        sub: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      }

      const { accessToken, refreshToken } =
        await this.generateTokens(cleanPayload)

      const newHashed = await this.hashToken(refreshToken)

      await this.usersService.setCurrentRefreshToken(
        newHashed,
        user._id.toString(),
      )

      return { accessToken, refreshToken }
    } catch (err) {
      console.error('Erro no refresh:', err)
      throw new HttpException(
        'Token de atualização inválido.',
        HttpStatus.UNAUTHORIZED,
      )
    }
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.removeRefreshToken(userId)
  }
}
