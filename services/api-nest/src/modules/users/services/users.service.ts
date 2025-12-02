import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { hash } from 'bcrypt';
import { UsersRepository } from '../repository/users.repository';
import type {
    UserModelWithoutPassword,
    UserModel,
} from '../interfaces/users.interface';

@Injectable()
export class UsersService {
    constructor(private readonly repo: UsersRepository) {}

    async existingEmail(email: string): Promise<boolean> {
        const count = await this.repo.findEmailCount(email);
        return count > 0;
    }

    async existingUsername(username: string): Promise<boolean> {
        const count = await this.repo.findUsernameCount(username);
        return count > 0;
    }

    async findAll(): Promise<UserModelWithoutPassword[]> {
        const users: UserModelWithoutPassword[] = await this.repo.findAll();
        return users;
    }

    async findOne(id: string): Promise<UserModelWithoutPassword | never> {
        const user: UserModelWithoutPassword | null =
            await this.repo.findOne(id);

        if (!user) {
            throw new HttpException(
                'Usuário não encontrado',
                HttpStatus.NOT_FOUND
            );
        }

        return user;
    }

    async findByEmailWithPassword(email: string): Promise<UserModel | null> {
        const user = await this.repo.findByEmailWithPassword(email);
        return user;
    }

    async findByUsernameWithPassword(
        username: string
    ): Promise<UserModel | null> {
        const user = await this.repo.findByUsernameWithPassword(username);
        return user;
    }

    async create(
        dto: CreateUserDto
    ): Promise<UserModelWithoutPassword | never> {
        const existyUsername = await this.existingUsername(dto.username);

        if (existyUsername) {
            throw new HttpException(
                'O nome de usuário já cadastrado.',
                HttpStatus.CONFLICT
            );
        }

        const existyEmail = await this.existingEmail(dto.email);

        if (existyEmail) {
            throw new HttpException(
                'Endereço de e-mail já cadastrado.',
                HttpStatus.CONFLICT
            );
        }

        const userWithoutPassword: UserModelWithoutPassword =
            await this.repo.create(dto);

        return userWithoutPassword;
    }

    async setCurrentRefreshToken(
        refreshToken: string,
        id: string
    ): Promise<void> {
        await this.findOne(id);
        await this.repo.setCurrentRefreshToken(refreshToken, id);
    }

    async removeRefreshToken(id: string): Promise<void> {
        await this.repo.removeRefreshToken(id);
    }

    async update(
        dto: UpdateUserDto,
        id: string
    ): Promise<UserModelWithoutPassword> {
        await this.findOne(id);

        if (dto.username) await this.existingUsername(dto.username);

        const password: string | undefined = dto.password
            ? await hash(dto.password, 10)
            : dto.password;

        const data = {
            ...dto,
            password,
        };

        const user = (await this.repo.update(
            data,
            id
        )) as UserModelWithoutPassword;

        return user;
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}
