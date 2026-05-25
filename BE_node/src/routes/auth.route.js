import { Router } from "express"
import { login, logout, register } from "../controler/auth.controler.js";


export const authRouter = Router();

authRouter.post('/register', register )

authRouter.post('/login', login )
authRouter.post('/logout', logout )