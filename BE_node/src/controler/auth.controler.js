import { prisma } from "../config/prisma.js";
import bcrypt from "bcryptjs";

const register = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }
    //check if user existin
    const userExits = await prisma.user.findUnique({
        where: { email: email }
    })

    if (userExits) {
        return res.status(400).json({ message: "User already exists" })
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
        }
    })
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

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

    return res.status(200).json({
        message: "Login successful",
        user: {
            username: userExits.username,
            email: userExits.email
        }
    })
}
export { register, login };
