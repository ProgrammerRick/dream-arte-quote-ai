import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const fileName = `${randomUUID()}-${safeName}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    await writeFile(filePath, buffer);

    return Response.json({
      url: `/uploads/${fileName}`,
      name: file.name,
      mimeType: file.type,
      sizeBytes: buffer.byteLength,
    });
  } catch {
    return Response.json({ error: "Falha ao processar upload." }, { status: 500 });
  }
}
