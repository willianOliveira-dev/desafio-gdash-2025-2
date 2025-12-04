import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../interfaces/users.interface';
import { User } from '../schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import type {
    UserModelWithoutPassword,
    UserModel,
    UserModelWithRefreshToken,
} from '../interfaces/users.interface';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) {}

    async findAll(): Promise<UserModelWithoutPassword[]> {
        return this.userModel
            .find()
            .select('-password -currentHashedRefreshToken -__v')
            .lean()
            .exec();
    }

    async findOne(id: string): Promise<UserModelWithoutPassword | null> {
        return this.userModel
            .findById(id)
            .select('-password -currentHashedRefreshToken -__v')
            .lean()
            .exec();
    }

    async findOneWithRefreshToken(
        id: string
    ): Promise<UserModelWithRefreshToken | null> {
        return this.userModel
            .findById(id)
            .select('-password -__v')
            .lean()
            .exec();
    }

    async findEmailCount(email: string): Promise<number> {
        return this.userModel
            .countDocuments({
                email,
            })
            .exec();
    }

    async findUsernameCount(username: string): Promise<number> {
        return this.userModel
            .countDocuments({
                username,
            })
            .exec();
    }

    async findByEmailWithPassword(email: string): Promise<UserModel | null> {
        return this.userModel
            .findOne({
                email,
            })
            .select('-currentHashedRefreshToken -__v')
            .lean()
            .exec();
    }

    async findByUsernameWithPassword(
        username: string
    ): Promise<UserModel | null> {
        return this.userModel
            .findOne({
                username,
            })
            .select('-currentHashedRefreshToken -__v')
            .lean()
            .exec();
    }

    async create(dto: CreateUserDto): Promise<UserModelWithoutPassword> {
        const data: User = {
            ...dto,
            firstName: dto.firstName ?? null,
            lastname: dto.lastname ?? null,
            avatar: dto.avatar ?? null,
            currentHashedRefreshToken: null,
        };

        const createdUser = new this.userModel(data);

        const savedUserDocument = await createdUser.save();

        const user = savedUserDocument.toObject();

        const { password, __v, ...userWithoutPassword } = user;

        return userWithoutPassword;
    }

    async setCurrentRefreshToken(
        refreshToken: string,
        id: string
    ): Promise<void> {
        await this.userModel
            .findByIdAndUpdate(
                id,
                { currentHashedRefreshToken: refreshToken },
                { new: true }
            )
            .exec();
    }

    async removeRefreshToken(id: string): Promise<void> {
        await this.userModel
            .findByIdAndUpdate(
                id,
                { currentHashedRefreshToken: null },
                { new: true }
            )
            .exec();
    }

    async update(
        dto: UpdateUserDto,
        id: string
    ): Promise<UserModelWithoutPassword | null> {
        return this.userModel
            .findByIdAndUpdate(id, dto, { new: true })
            .lean()
            .select('-password  -currentHashedRefreshToken -__v')
            .exec();
    }

    async delete(id: string): Promise<void> {
        await this.userModel.deleteOne({ _id: id }).exec();
    }
}
