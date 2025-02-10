import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const query = `
      SELECT r.*, u.name as user_name
      FROM recetas r
      INNER JOIN users u ON r.user_id = u.id
    `;
    const result = await pool.query(query);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
