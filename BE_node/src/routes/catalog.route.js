import { Router } from "express"

// routes/ - Defines endpoints and the middleware order before controllers.
export const catalogRouter = Router()

////////////////////////////////
// GET /allRecipe - Get all recipe from catlog.
catalogRouter.get("/", (req, res) => {
  res.json({ message: "Get all recipe from catlog" })
})
