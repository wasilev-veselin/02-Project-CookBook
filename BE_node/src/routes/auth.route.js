import { Router } from "express"
import { login, logout, register } from "../controler/auth.controler.js";
import { validateBody } from "../middware/validateBody.js";
import { loginSchema, registerSchema } from "../middware/authValidation.js";


export const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema), register )

authRouter.post('/login', validateBody(loginSchema), login )
authRouter.post('/logout', logout )
