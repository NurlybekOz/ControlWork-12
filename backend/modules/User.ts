import mongoose, {HydratedDocument, Model} from "mongoose";
import {UserFields} from "../types";
import {randomUUID} from "node:crypto";
import argon2 from "argon2";

interface UserMethods {
    checkPassword: (password: string) => Promise<boolean>;
    generateToken(): void;
}
interface UserVirtuals {
    confirmPassword: string;
}
const ARGON2_OPTIONS = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type UserModel = Model<UserFields, {}, UserMethods>;


const UserSchema = new mongoose.Schema<
    HydratedDocument<UserFields>,
    UserModel,
    UserMethods,
    {},
    UserVirtuals
>({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [
            {
                validator: async function(value: string): Promise<boolean> {
                    return emailRegex.test(value);
                },
                message: "This email is invalid"
            },
            {
                validator: async function(value: string): Promise<boolean> {
                    if (!this.isModified('email')) return true;
                    const user: HydratedDocument<UserFields> | null = await User.findOne({email: value});
                    return !user;
                },
                message: "This email is already taken"
            }
        ]
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin'],
    },
    token: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    googleID: String,
});

UserSchema.methods.checkPassword = async function (password: string){
    return await argon2.verify(this.password, password);
}

UserSchema.methods.generateToken = function (){
    this.token = randomUUID();
}

UserSchema.pre('save', async function (next){
    if (!this.isModified("password")) return next();

    this.password = await argon2.hash(this.password, ARGON2_OPTIONS);
    next();
});

UserSchema.set("toJSON", {
    transform: (_doc, ret) => {
        delete ret.password;
        return ret;
    }
})

const User = mongoose.model('User', UserSchema);
export default User;