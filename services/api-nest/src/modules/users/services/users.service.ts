import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { hash } from 'bcrypt';
import { UsersRepository } from '../repository/users.repository';
import type { UserWithoutPassword } from '../interfaces/users.interface';

@Injectable()
export class UsersService {
    constructor(private readonly repo: UsersRepository) {}

    private async existingEmail(email: string): Promise<never | void> {
        const existy = await this.repo.findEmail(email);

        if (!!existy) {
            throw new HttpException(
                'Endereço de e-mail já cadastrado.',
                HttpStatus.CONFLICT
            );
        }

        return;
    }

    private async existingUsername(username: string): Promise<never | void> {
        const existy = await this.repo.findUsername(username);

        if (!!existy) {
            throw new HttpException(
                'Nome de usuário já cadastrado.',
                HttpStatus.CONFLICT
            );
        }

        return;
    }

    async findAll(): Promise<UserWithoutPassword[]> {
        const users: UserWithoutPassword[] = await this.repo.findAll();
        return users;
    }

    async findOne(id: string): Promise<UserWithoutPassword | never> {
        const user: UserWithoutPassword | null = await this.repo.findOne(id);

        if (!user) {
            throw new HttpException(
                'Usuário não encontrado',
                HttpStatus.NOT_FOUND
            );
        }

        return user;
    }

    async create(dto: CreateUserDto): Promise<UserWithoutPassword> {
        await this.existingUsername(dto.username);
        await this.existingEmail(dto.email);

        const userWithoutPassword: UserWithoutPassword =
            await this.repo.create(dto);

        return userWithoutPassword;
    }

    async update(dto: UpdateUserDto, id: string): Promise<UserWithoutPassword> {
        await this.findOne(id);

        if (dto.username) await this.existingUsername(dto.username);

        const password: string | undefined = dto.password
            ? await hash(dto.password, 10)
            : dto.password;

        const data: Partial<User> = {
            ...dto,
            password,
        };

        const user = (await this.repo.update(data, id)) as UserWithoutPassword;

        return user;
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}
