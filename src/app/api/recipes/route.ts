import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const result = await pool.query("SELECT * FROM recipes")
    console.log("Fetched recipes:", result.rows)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Error fetching recipes from database" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, ingredients, steps , image_url , user_id} = await req.json()

 
    if (!title || !description || !ingredients || !steps || !image_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const query = `
      INSERT INTO recetas (title, description, ingredients, steps , image_url , user_id)
      VALUES ($1, $2, $3, $4 ,$5, $6)
      RETURNING *
    `
    const values = [title, description, ingredients, steps , image_url , user_id]
    const result = await pool.query(query, values)

    console.log("Created recipe:", result.rows[0])
    return NextResponse.json({ recipe: result.rows[0] })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Error creating recipe in database" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, user_id } = await req.json()

    if (!id || !user_id) {
      return NextResponse.json({ error: "Recipe ID and user ID are required" }, { status: 400 })
    }

    const findQuery = "SELECT * FROM recetas WHERE id = $1"
    const findResult = await pool.query(findQuery, [id])

    if (findResult.rows.length === 0) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    const recipe = findResult.rows[0]
    if (recipe.user_id !== user_id) {
      return NextResponse.json({ error: "Not authorized to delete this recipe" }, { status: 403 })
    }

    const deleteQuery = "DELETE FROM recetas WHERE id = $1 RETURNING *"
    const deleteResult = await pool.query(deleteQuery, [id])

    return NextResponse.json({ recipe: deleteResult.rows[0] })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Error deleting recipe from database" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, title, description, ingredients, steps , image_url, user_id } = await req.json()

    if (!id || !title || !description || !ingredients || !steps || !image_url || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const findQuery = "SELECT * FROM recetas WHERE id = $1"
    const findResult = await pool.query(findQuery, [id])

    if (findResult.rows.length === 0) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    const recipe = findResult.rows[0]
    if (recipe.user_id !== user_id) {
      return NextResponse.json({ error: "Not authorized to edit this recipe" }, { status: 403 })
    }

    const query = `
      UPDATE recetas 
      SET title = $1, description = $2, ingredients = $3, steps = $4 , image_url = $5
      WHERE id = $6
      RETURNING *
    `
    const values = [title, description, ingredients, steps,  image_url, id]
    const result = await pool.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    return NextResponse.json({ recipe: result.rows[0] })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Error updating recipe in database" }, { status: 500 })
  }
}

