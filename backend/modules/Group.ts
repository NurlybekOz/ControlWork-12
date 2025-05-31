import mongoose from "mongoose";
import User from "./User";

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        validate: {
            validator: async (value: string) => {
                const user = await User.findById(value)
                return !!(user);
            },
            message: 'User not found',
        }

    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    people: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        }
    ],
    isPublished: {
        type: Boolean,
        default: false,
    },
})

const Group = mongoose.model('Group', GroupSchema);
export default Group;