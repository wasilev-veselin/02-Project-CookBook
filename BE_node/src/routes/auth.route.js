import { Router } from "express"
import { login, register } from "../controler/auth.controler.js";


export const authRouter = Router();

authRouter.post('/register', register )

authRouter.post('/login', login )