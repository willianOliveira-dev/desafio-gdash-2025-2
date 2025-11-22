import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../interfaces/users.interface';
import { User } from '../schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import type { UserWithoutPassword } from '../interfaces/users.interface';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) {}

    async findAll(): Promise<UserWithoutPassword[]> {
        return this.userModel.find().select('-password -__v').lean().exec();
    }

    async findOne(id: string): Promise<UserWithoutPassword | null> {
        return this.userModel.findById(id).select('-password -__v').lean().exec();
    }

    async findEmail(email: string): Promise<UserWithoutPassword | null> {
        return this.userModel
            .findOne({
                email,
            })
            .select('-password -__v')
            .lean()
            .exec();
    }

    async findUsername(username: string): Promise<UserWithoutPassword | null> {
        return this.userModel
            .findOne({
                username,
            })
            .select('-password -__v')
            .lean()
            .exec();
    }

    async create(dto: CreateUserDto): Promise<UserWithoutPassword> {

        const data: User = {
            ...dto,
            firstName: dto.firstName ?? undefined,
            lastname: dto.lastname ?? undefined,
        };

        const createdUser = new this.userModel(data);

        const savedUserDocument = await createdUser.save();

        const user = savedUserDocument.toObject();

        const { password, __v, ...userWithoutPassword } = user;

        return userWithoutPassword;
    }

    async update(
        dto: UpdateUserDto,
        id: string
    ): Promise<UserWithoutPassword | null> {
        return this.userModel
            .findByIdAndUpdate(id, dto, { new: true })
            .lean()
            .select('-password -__v')
            .exec();
    }

    async delete(id: string): Promise<void> {
        await this.userModel.deleteOne({ _id: id }).exec();
    }
}
