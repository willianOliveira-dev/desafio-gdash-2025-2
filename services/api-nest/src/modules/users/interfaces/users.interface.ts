import { Document } from 'mongoose';
import { User } from '../schemas/user.schema';

export type UserDocument = User & Document;
export type UserWithoutPassword = Omit<User, "password">