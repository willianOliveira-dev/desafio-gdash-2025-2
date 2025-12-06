import { Exclude, Transform } from 'class-transformer'
import {
  IsString,
  IsEmail,
  Length,
  IsOptional,
  IsIn,
  Matches,
  IsNotEmpty,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserModelWithoutPasswordSwaggerDto {
  @ApiProperty({
    example: '60c72b2f9f1b9e0015b67a4e',
    description: 'ID exclusivo (ObjectId do MongoDB)',
  })
  _id: string

  @ApiProperty({
    example: 'admin',
    description:
      'Nome de usuário único. Deve ter entre 2 e 25 caracteres. Permitido: letras, números, hífen (-) e underscore (_). Será transformado para minúsculo.',
    minLength: 2,
    maxLength: 25,
    pattern: '^[A-Za-z0-9_-]+$',
  })
  @IsNotEmpty({ message: 'O nome de usuário é obrigatório.' })
  @IsString({ message: 'O nome de usuário deve ser uma string.' })
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message: 'Só são permitidos letras, números, "-" e "_"',
  })
  @Length(2, 25, {
    message: 'O nome de usuário deve ter entre 2 e 25 caracteres.',
  })
  @Transform(({ value }) => value.toLowerCase() as string)
  username: string

  @ApiProperty({
    example: 'joao@dominio.com',
    description: 'Endereço de e-mail do usuário (deve ser único).',
  })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'O e-mail informado não é válido.' })
  email: string

  @ApiProperty({
    example: 'https://localhost:3000/public/images/default-avatar.png',
    description: 'URL opcional para a imagem de avatar do usuário.',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'O avatar deve ser uma string (URL ou caminho).' })
  avatar?: string

  @ApiProperty({
    example: 'user',
    description: 'Papel ou nível de permissão do usuário.',
    enum: ['user', 'admin'],
    default: 'user',
    required: false,
  })
  @IsString({ message: 'O papel do usuário deve ser uma string.' })
  @IsIn(['user', 'admin'], { message: 'O papel deve ser "user" ou "admin".' })
  role: string = 'user'

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Data e hora da criação do registro.',
  })
  createdAt: Date

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Data e hora da última atualização do registro.',
  })
  updatedAt: Date
}
