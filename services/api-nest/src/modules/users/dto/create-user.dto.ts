import {
    IsString,
    IsEmail,
    Length,
    IsOptional,
    IsIn,
    Matches,
    IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
    // username
    @IsNotEmpty({ message: 'O nome de usuário é obrigatório.' })
    @IsString({ message: 'O nome de usuário deve ser uma string.' })
    @Length(2, 25, {
        message: 'O nome de usuário deve ter entre 2 e 25 caracteres.',
    })
    username: string;

    // email
    @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
    @IsEmail({}, { message: 'O e-mail informado não é válido.' })
    email: string;

    @IsNotEmpty({ message: 'A senha é obrigatória.' })
    // password
    @IsString({ message: 'A senha deve ser uma string.' })
    @Length(8, 64, { message: 'A senha deve ter entre 8 e 64 caracteres.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,#^()\-_=+]).+$/, {
        message:
            'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
    })
    password: string;

    // avatar
    @IsOptional()
    @IsString({ message: 'O avatar deve ser uma string (URL ou caminho).' })
    avatar?: string;

    // firstname
    @IsOptional()
    @IsString({ message: 'O primeiro nome deve ser uma string.' })
    @Length(2, 50, {
        message: 'O primeiro nome deve ter entre 2 e 50 caracteres.',
    })
    firstName?: string;

    // lastname
    @IsOptional()
    @IsString({ message: 'O sobrenome deve ser uma string.' })
    @Length(2, 50, { message: 'O sobrenome deve ter entre 2 e 50 caracteres.' })
    lastname?: string;

    // role
    @IsString({ message: 'O papel do usuário deve ser uma string.' })
    @IsIn(['user', 'admin'], { message: 'O papel deve ser "user" ou "admin".' })
    role: string;
}
