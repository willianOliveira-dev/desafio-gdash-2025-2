import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AvatarModelSwaggerDto {
  @ApiProperty({
    example: 'https://localhost:3000/public/images/default-avatar.png',
    description: 'URL opcional para a imagem de avatar do usuário.',
    required: false,
    nullable: true,
  })
  @IsString({ message: 'O avatar deve ser uma string (URL ou caminho).' })
  url: string
}
