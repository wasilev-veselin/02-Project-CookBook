import { Router } from "express"

// routes/ - Defines endpoints and the middleware order before controllers.
export const cookbookRouter = Router()

////////////////////////////////
// GET /tasks - returns all tasks.
cookbookRouter.get("/", (req, res, next) => {
    res.json({ message: "Get all item from catlog" })
})