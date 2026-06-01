import { z } from 'zod'

export const recipeDifficultySchema = z.enum(['EASY', 'MEDIUM', 'HARD'])

export type RecipeDifficulty = z.infer<typeof recipeDifficultySchema>

export const recipeSchema = z.object({
  id: z.number(),
  authorId: z.number(),
  typeId: z.number(),
  title: z.string(),
  description: z.string(),
  instructions: z.string(),
  cookingTime: z.number(),
  difficulty: recipeDifficultySchema,
  servings: z.number(),
  imageUrl: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: z.object({
    id: z.number(),
    username: z.string(),
    email: z.string().optional(),
  }),
  type: z.object({
    id: z.number(),
    name: z.string(),
  }),
  ingredients: z.array(
    z.object({
      id: z.number(),
      recipeId: z.number(),
      name: z.string(),
      quantity: z.string(),
      unit: z.string(),
    }),
  ),
  comments: z
    .array(
      z.object({
        id: z.number(),
        recipeId: z.number(),
        authorId: z.number(),
        content: z.string(),
        rating: z.number(),
        createdAt: z.string(),
        author: z.object({
          id: z.number(),
          username: z.string(),
        }),
      }),
    )
    .optional(),
})

export type Recipe = z.infer<typeof recipeSchema>
