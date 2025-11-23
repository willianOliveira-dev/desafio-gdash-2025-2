import { IsNotEmpty } from 'class-validator';

export class LoginDto {
    // username or email
    @IsNotEmpty({ message: 'O nome de usuário ou email é obrigatório.' })
    usernameOrEmail: string;

    // password
    @IsNotEmpty({ message: 'A senha é obrigatória.' })
    password: string;
}
