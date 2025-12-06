import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { AvatarsService } from '../services/avatars.service'
import { ConfigService } from '@nestjs/config'
import { Env } from 'src/env.validation'
import { UsersService } from 'src/modules/users/services/users.service'
import { ApiStandardResponse } from 'src/common/swagger/decorators/api-standard-response.decorator'
import { AvatarModelSwaggerDto } from 'src/common/swagger/dto/avatar-model-swagger.dto'
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import multer from 'multer'
import type { ResponseApi } from 'src/common/interfaces/response-api.interface'
import { ApiAuth } from 'src/common/swagger/decorators/api-cookies-auth.decorator'
import { ApiErrorResponseDto } from 'src/common/swagger/dto/api-error-response.dto'

@Controller('avatars')
@ApiTags('Avatar')
@UseGuards(JwtAuthGuard)
export class AvatarsController {
  constructor(
    private readonly avatarsService: AvatarsService,
    private readonly config: ConfigService<Env>,
    private readonly usersService: UsersService,
  ) {}

  @Post('upload')
  @ApiStandardResponse(AvatarModelSwaggerDto)
  @ApiBadRequestResponse({
    description: 'ID do usuário é obrigatório.',
    type: ApiErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Somente arquivos JPG/PNG são permitidos.',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado.',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'O tamanho do arquivo deve ser menor ou igual a 10MB.',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Arquivo não enviado.',
    type: ApiErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro ao enviar imagem.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor',
    type: ApiErrorResponseDto,
  })
  @ApiAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_, file: Express.Multer.File, cb) => {
        const allowed: [string, string, string] = [
          'image/png',
          'image/jpg',
          'image/jpeg',
        ]
        if (allowed.includes(file.mimetype)) {
          cb(null, true)
        } else {
          cb(
            new HttpException(
              'Somente arquivos JPG/PNG são permitidos.',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          )
        }
      },
    }),
  )
  async uploadImage(
    @Body('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseApi<{ url: string }>> {
    if (!userId) {
      throw new HttpException(
        'ID do usuário é obrigatório.',
        HttpStatus.BAD_REQUEST,
      )
    }
    await this.usersService.findOne(userId)

    let url: string

    if (this.config.get('ENABLE_AVATAR_UPLOAD') === 'true') {
      url = await this.avatarsService.uploadImage(file, userId)
    } else {
      const baseUrl = this.config.get('BASE_URL') as string
      url = `${baseUrl}/public/images/default-avatar.png`
    }

    await this.usersService.update({ avatar: url }, userId)

    return { message: 'Avatar atualizado com sucesso.', data: { url } }
  }
}
