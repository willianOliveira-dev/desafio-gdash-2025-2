import { Body, Controller, HttpCode, Param, UseGuards } from '@nestjs/common'
import { UsersService } from '../services/users.service'
import { Get, Post, Delete, Patch } from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
import { ParseObjectIdPipe } from '../../../common/pipes/parseObjectIdPipe'
import { UpdateUserDto } from '../dto/update-user.dto'
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { ApiStandardResponse } from 'src/common/swagger/decorators/api-standard-response.decorator'
import { UserModelWithoutPasswordSwaggerDto } from 'src/common/swagger/dto/user-model-without-password-swagger.dto'
import { ApiAuth } from 'src/common/swagger/decorators/api-cookies-auth.decorator'
import type { ResponseApi } from 'src/common/interfaces/response-api.interface'
import type { UserModelWithoutPassword } from '../interfaces/users.interface'
import { ApiErrorResponseDto } from 'src/common/swagger/dto/api-error-response.dto'
@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiStandardResponse(UserModelWithoutPasswordSwaggerDto, true)
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor.',
    type: ApiErrorResponseDto,
  })
  @ApiAuth()
  async findAllUsers(): Promise<ResponseApi<UserModelWithoutPassword[]>> {
    const user = await this.usersService.findAll()
    return { message: 'Usuários encontrados com sucesso.', data: user }
  }

  @Get(':id')
  @ApiStandardResponse(UserModelWithoutPasswordSwaggerDto)
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado.',
    type: ApiErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'ObjectId inválido.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor.',
    type: ApiErrorResponseDto,
  })
  @ApiAuth()
  async findOneUser(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<ResponseApi<UserModelWithoutPassword>> {
    const user = await this.usersService.findOne(id)
    return { message: 'Usuário encontrado com sucesso.', data: user }
  }

  @Post()
  @ApiStandardResponse(UserModelWithoutPasswordSwaggerDto, false, 201)
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    type: ApiErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'O nome de usuário já cadastrado.',
    type: ApiErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Endereço de e-mail já cadastrado.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor.',
    type: ApiErrorResponseDto,
  })
  @ApiAuth()
  async createUser(
    @Body() dto: CreateUserDto,
  ): Promise<ResponseApi<UserModelWithoutPassword>> {
    const user = await this.usersService.create(dto)
    return { message: 'Usuário criado com sucesso.', data: user }
  }

  @Patch(':id')
  @ApiStandardResponse(UserModelWithoutPasswordSwaggerDto)
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado.',
    type: ApiErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'ObjectId inválido.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor.',
    type: ApiErrorResponseDto,
  })
  @ApiAuth()
  async update(
    @Body() dto: UpdateUserDto,
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<ResponseApi<UserModelWithoutPassword>> {
    const user = await this.usersService.update(dto, id)
    return { message: 'Usuário atualizado com sucesso.', data: user }
  }

  @Delete(':id')
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado.',
    type: ApiErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'ObjectId inválido.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor.',
    type: ApiErrorResponseDto,
  })
  @ApiAuth()
  @HttpCode(204)
  async deleteUser(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    await this.usersService.delete(id)
    return
  }
}
