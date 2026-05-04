import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_TOKEN, {
        expiresIn: '15m',
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret', {
        expiresIn: '7d',
    });
};

export const userRegister = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }

        const exists = await User.findOne({ email });

        if (exists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashed,
            role
        });

        const token = generateToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        newUser.refreshToken = refreshToken;
        await newUser.save();

        res.status(201)
        .json({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token,
            refreshToken
        });
    } 
    
    catch (error) {
        res.status(500)
        .json({
            message: error.message
        });
    }
};

export const userLogin = async (req, res) => {
    try {
        const { 
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const existingUser = await User.findOne({ email }).select("+password");

        if (existingUser && await bcrypt.compare(password, existingUser.password)) {
            const token = generateToken(existingUser._id);
            const refreshToken = generateRefreshToken(existingUser._id);

            existingUser.refreshToken = refreshToken;
            await existingUser.save();

            res.json({
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                token,
                refreshToken
            });
        } 
        
        else {
            res.status(401)
            .json({
                message: "Invalid Credentials."
            });
        }
    } 
    
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { 
            token
        } = req.body;

        if (!token) {
            return res.status(401)
            .json({
                message: "Refresh token is required."
            });
        }

        const user = await User.findOne({ refreshToken: token });

        if (!user) {
            return res.status(403)
            .json({
                message: "Invalid refresh token."
            });
        }

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret', (err, decoded) => {
            if (err) {
                return res.status(403)
                .json({
                    message: "Refresh token expired or invalid."
                });
            }

            const newAccessToken = generateToken(user._id);
            res.json({ token: newAccessToken });
        });
    } 
    
    catch (error) {
        res.status(500)
        .json({
            message: error.message
        });
    }
};