import { Document, Types } from 'mongoose';
import { User } from '../schemas/user.schema';


export type UserDocument = User & Document;
export type UserModelWithoutPassword = Omit<User, 'password'> & { _id: Types.ObjectId };
export type UserModel = User & { _id: Types.ObjectId };
