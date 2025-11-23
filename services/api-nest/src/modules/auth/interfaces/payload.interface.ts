import { Types } from 'mongoose';

export interface Payload {
    sub: Types.ObjectId;
    username: string;
    email: string;
    role: string;
}
