import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcrypt';

@Schema({
    timestamps: true,
})
export class User {
    // name
    @Prop({
        required: true,
        minLength: 2,
        maxLength: 25,
        unique: true,
    })
    username: string;

    // email
    @Prop({
        required: true,
        unique: true,
    })
    email: string;

    // password
    @Prop({
        required: true,
        minLength: 8,
        maxLength: 64,
    })
    password: string;

    // avatar
    @Prop()
    avatar?: string;

    //firstName
    @Prop({
        minLength: 2,
        maxLength: 50,
        default: null,
    })
    firstName?: string;

    //lastname
    @Prop({
        minLength: 2,
        maxLength: 50,
        default: null,
    })
    lastname?: string;

    // role
    @Prop({
        default: 'user',
        enum: ['user', 'admin'],
    })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await hash(this.password, 10);

    next();
});
