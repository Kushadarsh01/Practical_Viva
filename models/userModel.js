import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema(
    {
        name: {
        type: String,
        required: true,
        trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true,
            minLength: 6,
            select: false
        },

        role: {
            type: String,
            default: 'User'
        },

        refreshToken: {
            type: String
        }
    },

    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema);

export default User;