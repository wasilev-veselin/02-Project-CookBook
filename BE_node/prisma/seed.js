import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ["alice@example.com", "bob@example.com"],
      },
    },
  })

  const [breakfast, dinner, dessert] = await Promise.all([
    prisma.recipeType.upsert({
      where: { name: "BREAKFAST" },
      update: {},
      create: { name: "BREAKFAST" },
    }),
    prisma.recipeType.upsert({
      where: { name: "DINNER" },
      update: {},
      create: { name: "DINNER" },
    }),
    prisma.recipeType.upsert({
      where: { name: "DESSERT" },
      update: {},
      create: { name: "DESSERT" },
    }),
  ])

  const alice = await prisma.user.create({
    data: {
      email: "alice@example.com",
      username: "alice",
      passwordHash: "test-password-hash",
    },
  })

  const bob = await prisma.user.create({
    data: {
      email: "bob@example.com",
      username: "bob",
      passwordHash: "test-password-hash",
    },
  })

  const pancakes = await prisma.recipe.create({
    data: {
      authorId: alice.id,
      typeId: breakfast.id,
      title: "Fluffy Pancakes",
      description: "Simple breakfast pancakes.",
      instructions: "Mix the ingredients. Cook on a hot pan until golden.",
      cookingTime: 20,
      difficulty: "EASY",
      servings: 4,
      imageUrl: "https://images.unsplash.com/photo-1528207776546-365bb710ee93",
      ingredients: {
        create: [
          { name: "Flour", quantity: "200", unit: "g" },
          { name: "Milk", quantity: "250", unit: "ml" },
          { name: "Eggs", quantity: "2", unit: "pcs" },
        ],
      },
    },
  })

  const pasta = await prisma.recipe.create({
    data: {
      authorId: bob.id,
      typeId: dinner.id,
      title: "Tomato Pasta",
      description: "Fast pasta with tomato sauce.",
      instructions: "Boil pasta. Cook sauce. Combine and serve.",
      cookingTime: 30,
      difficulty: "MEDIUM",
      servings: 2,
      imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0",
      ingredients: {
        create: [
          { name: "Pasta", quantity: "250", unit: "g" },
          { name: "Tomatoes", quantity: "400", unit: "g" },
          { name: "Garlic", quantity: "2", unit: "cloves" },
        ],
      },
    },
  })

  const cake = await prisma.recipe.create({
    data: {
      authorId: alice.id,
      typeId: dessert.id,
      title: "Chocolate Mug Cake",
      description: "Quick dessert in a mug.",
      instructions: "Mix everything in a mug and microwave for 90 seconds.",
      cookingTime: 5,
      difficulty: "EASY",
      servings: 1,
      imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
      ingredients: {
        create: [
          { name: "Cocoa", quantity: "2", unit: "tbsp" },
          { name: "Flour", quantity: "4", unit: "tbsp" },
          { name: "Sugar", quantity: "2", unit: "tbsp" },
        ],
      },
    },
  })

  await prisma.favoriteRecipe.createMany({
    data: [
      { userId: alice.id, recipeId: pasta.id },
      { userId: bob.id, recipeId: pancakes.id },
      { userId: bob.id, recipeId: cake.id },
    ],
  })

  await prisma.comment.createMany({
    data: [
      {
        recipeId: pancakes.id,
        authorId: bob.id,
        content: "Very easy and tasty.",
        rating: 5,
      },
      {
        recipeId: pasta.id,
        authorId: alice.id,
        content: "Good weeknight dinner.",
        rating: 4,
      },
    ],
  })

  await prisma.mealPlan.createMany({
    data: [
      {
        userId: alice.id,
        recipeId: pancakes.id,
        date: new Date("2026-05-23T08:00:00.000Z"),
        mealType: "BREAKFAST",
      },
      {
        userId: alice.id,
        recipeId: pasta.id,
        date: new Date("2026-05-23T19:00:00.000Z"),
        mealType: "DINNER",
      },
      {
        userId: bob.id,
        recipeId: cake.id,
        date: new Date("2026-05-24T15:00:00.000Z"),
        mealType: "SNACK",
      },
    ],
  })
}

main()
  .then(async () => {
    console.log("Seed data created.")
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
