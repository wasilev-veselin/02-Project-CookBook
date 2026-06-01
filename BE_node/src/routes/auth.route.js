import { Router } from "express"
import { login, logout, register } from "../controllers/auth.controller.js";
import { validateBody } from "../middleware/validateBody.js";
import { loginSchema, registerSchema } from "../validations/authValidation.js";


export const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema), register )

authRouter.post('/login', validateBody(loginSchema), login )
authRouter.post('/logout', logout )
