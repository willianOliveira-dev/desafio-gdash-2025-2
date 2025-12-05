import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcrypt';

@Schema({
    timestamps: true,
})
export class User {
    // name
    @Prop({
        type: String,
        required: true,
        minLength: 2,
        maxLength: 25,
        unique: true,
    })
    username: string;

    // email
    @Prop({
        type: String,
        required: true,
        unique: true,
    })
    email: string;

    // password
    @Prop({
        type: String,
        required: true,
        minLength: 8,
        maxLength: 64,
    })
    password: string;

    // avatar
    @Prop({ type: String })
    avatar?: string | null;

    // role
    @Prop({
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    })
    role: string;

    @Prop({ type: String, required: false, default: null })
    currentHashedRefreshToken?: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await hash(this.password, 10);

    next();
});
