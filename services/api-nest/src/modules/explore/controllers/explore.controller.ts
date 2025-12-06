import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ExploreService } from '../services/explore.service'
import { QueryParamApiExternal } from '../dto/query-param-api-external.dto'
import type { ResponseApi } from 'src/common/interfaces/response-api.interface'
import type { CharacterSchema } from '../interfaces/character-schema.interface'
import type { CharacterSchemaPagination } from '../interfaces/character-schema-paginationl.interface'
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ApiAuth } from 'src/common/swagger/decorators/api-cookies-auth.decorator'
import { ApiStandardResponse } from 'src/common/swagger/decorators/api-standard-response.decorator'
import { CharacterPaginationSwaggerDto } from 'src/common/swagger/dto/character-pagination-swagger.dto'
import { CharacterModelSwaggerDto } from 'src/common/swagger/dto/character-model-swagger.dto'
import { ApiErrorResponseDto } from 'src/common/swagger/dto/api-error-response.dto'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'

UseGuards(JwtAuthGuard)
@ApiTags('explore')
@Controller('explore')
export class ExploreController {
  constructor(private readonly exploreService: ExploreService) {}
  @Get('character')
  @ApiStandardResponse(CharacterPaginationSwaggerDto)
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Houve um erro ao buscar localização.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor',
    type: ApiErrorResponseDto,
  })
  @ApiAuth()
  async searchForCharacter(
    @Query() dto: QueryParamApiExternal,
  ): Promise<ResponseApi<CharacterSchemaPagination | []>> {
    const characters = await this.exploreService.searchForCharacters(dto)
    return {
      message: 'Personagens encontrados com sucesso.',
      data: characters,
    }
  }

  @Get('character/:id')
  @ApiStandardResponse(CharacterModelSwaggerDto)
  @ApiBadRequestResponse({
    description: 'O ID do personagem deve ser um valor inteiro.',
    type: ApiErrorResponseDto,
  })

  @ApiNotFoundResponse({
    description: 'Personagem não encontrado.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Houve um erro ao buscar localização.',
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
  @ApiAuth()
  async searchForCharacterById(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () =>
          new HttpException(
            'O ID do personagem deve ser um valor inteiro.',
            HttpStatus.BAD_REQUEST,
          ),
      }),
    )
    id: number,
  ): Promise<ResponseApi<CharacterSchema>> {
    const character = await this.exploreService.searchForCharacterById(id)
    return {
      message: 'Personagem encontrado com sucesso.',
      data: character,
    }
  }
}
