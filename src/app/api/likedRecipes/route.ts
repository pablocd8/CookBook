import { NextResponse } from "next/server";
import pool from "../../../lib/db";



export async function POST(request: Request) {
  try {
    const { recipeId, userId } = await request.json();
    console.log("Datos recibidos en el backend:", { recipeId, userId });

    if (!recipeId || !userId) {
      return NextResponse.json({ error: "recipeId and userId are required" }, { status: 400 });
    }
    
    // Verificar si el like ya existe
    const checkQuery = "SELECT * FROM liked_recipes WHERE user_id = $1 AND recipe_id = $2";
    const checkResult = await pool.query(checkQuery, [userId, recipeId]);
    if (checkResult.rows.length > 0) {
      return NextResponse.json({ message: "La receta ya está guardada" }, { status: 200 });
    }
    
    const query = `
      INSERT INTO liked_recipes (user_id, recipe_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(query, [userId, recipeId]);
    return NextResponse.json({ liked: result.rows[0] }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    const query = `
  SELECT 
    lr.*, 
    r.id AS recipe_id,
    r.title, 
    r.description, 
    r.ingredients, 
    r.steps, 
    r.image_url, 
    u.name AS user_name 
  FROM liked_recipes lr
  INNER JOIN recetas r ON lr.recipe_id = r.id
  INNER JOIN users u ON r.user_id = u.id  
  WHERE lr.user_id = $1
`;

  
    const result = await pool.query(query, [userId]);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
export async function DELETE(request: Request) {
    try {
        const { recipeId, userId } = await request.json();
        console.log("Datos recibidos en el backend:", { recipeId, userId });
    
        if (!recipeId || !userId) {
        return NextResponse.json({ error: "recipeId and userId are required" }, { status: 400 });
        }
        console.log(recipeId, userId);
        const query = `
        DELETE FROM liked_recipes 
        WHERE user_id = $1 AND id = $2
        `;
        const result = await pool.query(query, [Number(userId), Number(recipeId)]);
        return NextResponse.json({ deleted: result.rowCount }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
