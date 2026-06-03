import { prisma } from "../config/prisma.js";
import bcrypt from "bcryptjs";

import { AppError } from "../errors/AppError.js";
import { generateToken } from "../utils/generateToken.js";
import { sendSuccess } from "../utils/apiResponse.js";

const register = async (req, res, next) => {
    const { username, email, password } = req.body;

    //check if user existin
    const userExits = await prisma.user.findUnique({
        where: { email }
    })

    if (userExits) {
        throw new AppError(400, "EMAIL_ALREADY_EXISTS", "Email already exists")
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    //create user
    const user = await prisma.user.create({
        data: {
            username,
            email,
            passwordHash: hashedPassword
        }
    });
 
    generateToken(user.id, res)

    return sendSuccess(res, 201, {
        message: "User registered successfully",
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    })
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    //check if user existin
    const userExits = await prisma.user.findUnique({
        where: { email: email }
    })

    if (!userExits) {
        throw new AppError(401, "INVALID_CREDENTIALS", "Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(password, userExits.passwordHash);

    if (!isPasswordValid) {
        throw new AppError(401, "INVALID_CREDENTIALS", "Invalid credentials")
    }


   generateToken(userExits.id, res);
   
    return sendSuccess(res, 200, {
        message: "Login successful",
        user: {
            id: userExits.id,
            username: userExits.username,
            email: userExits.email
        }
    })
}

const logout = async (req, res, next) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        expires: new Date(0),
    });
    return sendSuccess(res, 200, { message: "Logout successful" })
}

export { register, login, logout };
