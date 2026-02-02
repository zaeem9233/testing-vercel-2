import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = params;

    const result = await sql`
      SELECT id, name, email, phone, company, position, status, notes, created_at, updated_at
      FROM crm_contacts
      WHERE id = ${id} AND user_id = ${userId}
      LIMIT 1
    `;

    if (result.length === 0) {
      return Response.json({ error: "Contact not found" }, { status: 404 });
    }

    return Response.json({ contact: result[0] });
  } catch (error) {
    console.error("Get contact error:", error);
    return Response.json({ error: "Failed to fetch contact" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = params;
    const body = await request.json();
    const { name, email, phone, company, position, status, notes } = body;

    const setClauses = [];
    const values = [];
    let paramCount = 0;

    if (name !== undefined) {
      paramCount++;
      setClauses.push(`name = $${paramCount}`);
      values.push(name);
    }
    if (email !== undefined) {
      paramCount++;
      setClauses.push(`email = $${paramCount}`);
      values.push(email);
    }
    if (phone !== undefined) {
      paramCount++;
      setClauses.push(`phone = $${paramCount}`);
      values.push(phone);
    }
    if (company !== undefined) {
      paramCount++;
      setClauses.push(`company = $${paramCount}`);
      values.push(company);
    }
    if (position !== undefined) {
      paramCount++;
      setClauses.push(`position = $${paramCount}`);
      values.push(position);
    }
    if (status !== undefined) {
      paramCount++;
      setClauses.push(`status = $${paramCount}`);
      values.push(status);
    }
    if (notes !== undefined) {
      paramCount++;
      setClauses.push(`notes = $${paramCount}`);
      values.push(notes);
    }

    if (setClauses.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    paramCount++;
    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

    const query = `
      UPDATE crm_contacts
      SET ${setClauses.join(", ")}
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING id, name, email, phone, company, position, status, notes, created_at, updated_at
    `;
    values.push(id, userId);

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Contact not found" }, { status: 404 });
    }

    return Response.json({ contact: result[0] });
  } catch (error) {
    console.error("Update contact error:", error);
    return Response.json(
      { error: "Failed to update contact" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = params;

    const result = await sql`
      DELETE FROM crm_contacts
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json({ error: "Contact not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete contact error:", error);
    return Response.json(
      { error: "Failed to delete contact" },
      { status: 500 },
    );
  }
}
