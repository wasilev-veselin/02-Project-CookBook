import { prisma } from "../config/prisma.js";
import bcrypt from "bcryptjs";

import { generateToken } from "../utils/generateToken.js";

const register = async (req, res, next) => {
    const { username, email, password } = req.body;

    //check if user existin
    const userExits = await prisma.user.findUnique({
        where: { email }
    })

    if (userExits) {
        return res.status(400).json({ message: "Email already exists" })
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
 
    return res.status(201).json({
        status: "User registered successfully",
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }, token: generateToken(user.id, res)

    })
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    //check if user existin
    const userExits = await prisma.user.findUnique({
        where: { email: email }
    })

    if (!userExits) {
        return res.status(401).json({ message: "Invalid credentials" })
    }

    const isPasswordValid = await bcrypt.compare(password, userExits.passwordHash);

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" })
    }


   const token = generateToken(userExits.id, res);
   
    return res.status(200).json({
        message: "Login successful",
        user: {
            username: userExits.username,
            email: userExits.email
        },
        token
    })
}

const logout = async (req, res, next) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        expires: new Date(0),
    });
    return res.status(200).json({ message: "Logout successful" })
}

export { register, login, logout };
