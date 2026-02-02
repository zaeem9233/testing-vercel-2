import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";

    let query = `
      SELECT id, name, email, phone, company, position, status, notes, created_at, updated_at
      FROM crm_contacts
      WHERE user_id = $1
    `;
    const values = [userId];
    let paramCount = 1;

    if (search) {
      paramCount++;
      query += ` AND (LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(email) LIKE LOWER($${paramCount}) OR LOWER(company) LIKE LOWER($${paramCount}))`;
      values.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      values.push(status);
    }

    query += ` ORDER BY created_at DESC`;

    const contacts = await sql(query, values);

    return Response.json({ contacts });
  } catch (error) {
    console.error("Get contacts error:", error);
    return Response.json(
      { error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { name, email, phone, company, position, status, notes } = body;

    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO crm_contacts (user_id, name, email, phone, company, position, status, notes)
      VALUES (${userId}, ${name}, ${email || null}, ${phone || null}, ${company || null}, ${position || null}, ${status || "lead"}, ${notes || null})
      RETURNING id, name, email, phone, company, position, status, notes, created_at, updated_at
    `;

    return Response.json({ contact: result[0] });
  } catch (error) {
    console.error("Create contact error:", error);
    return Response.json(
      { error: "Failed to create contact" },
      { status: 500 },
    );
  }
}
