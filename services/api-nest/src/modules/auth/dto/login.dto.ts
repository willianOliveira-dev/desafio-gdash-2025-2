import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
  @ApiProperty({
    example: 'admin ou admin@gdash.io',
    description:
      'Obrigatório. Pode ser o nome de usuário único ou o endereço de e-mail do usuário.',
  })
  @IsString({ message: 'Nome de usuário ou e-mail devem ser um texto.' })
  @IsNotEmpty({ message: 'O nome de usuário ou email é obrigatório.' })
  usernameOrEmail: string

  @ApiProperty({
    example: '@Gdash123',
    description: 'Obrigatório. Senha de acesso do usuário.',
    minLength: 8,
  })
  @IsString({ message: 'A senha deve ser um texto.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  password: string
}
