import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");
  if (!user_id) {
    return NextResponse.json({ error: "User id required" }, { status: 400 });
  }
  try {
    const query = "SELECT * FROM recetas WHERE user_id = $1";
    const result = await pool.query(query, [user_id]);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
