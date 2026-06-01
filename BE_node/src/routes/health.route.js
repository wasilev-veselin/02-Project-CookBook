import { Router } from "express"
import { sendSuccess } from "../utils/apiResponse.js"

export const healthRouter = Router()

healthRouter.get("/", (req, res) => {
  sendSuccess(res, 200, { message: "cookbook API!" })
})
