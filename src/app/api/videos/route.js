import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const videos = await sql`
      SELECT id, title, description, prompt, video_url, thumbnail_url, status, quality, created_at
      FROM videos
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return Response.json({ videos });
  } catch (error) {
    console.error("Get videos error:", error);
    return Response.json({ error: "Failed to fetch videos" }, { status: 500 });
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
    const { title, description, prompt, quality } = body;

    if (!title || !prompt) {
      return Response.json(
        { error: "Title and prompt are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO videos (user_id, title, description, prompt, quality, status)
      VALUES (${userId}, ${title}, ${description || null}, ${prompt}, ${quality || "1080p"}, 'processing')
      RETURNING id, title, description, prompt, status, quality, created_at
    `;

    return Response.json({ video: result[0] });
  } catch (error) {
    console.error("Create video error:", error);
    return Response.json({ error: "Failed to create video" }, { status: 500 });
  }
}