import { Body, Controller, HttpCode, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { Get, Post, Delete, Patch } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { ParseObjectIdPipe } from '../../../common/pipes/parseObjectIdPipe';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAllUsers() {
        const user = await this.usersService.findAll();
        return { message: 'Usuários encontrados com sucesso.', data: user };
    }

    @Get(':id')
    async findOneUser(@Param('id', ParseObjectIdPipe) id: string) {
        const user = await this.usersService.findOne(id);
        return { message: 'Usuário encontrado com sucesso.', data: user };
    }

    @Post()
    @HttpCode(201)
    async createUser(@Body() dto: CreateUserDto) {
        const user = await this.usersService.create(dto);
        return { message: 'Usuário criado com sucesso.', data: user };
    }

    @Patch(':id')
    async update(
        @Body() dto: UpdateUserDto,
        @Param('id', ParseObjectIdPipe) id: string
    ) {
        const user = await this.usersService.update(dto, id);
        return { message: 'Usuário atualizado com sucesso.', data: user };
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteUser(@Param('id', ParseObjectIdPipe) id: string) {
        await this.usersService.delete(id);
        return;
    }
}
