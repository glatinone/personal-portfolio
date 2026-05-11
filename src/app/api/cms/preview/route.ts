import { NextRequest, NextResponse } from "next/server";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    if (typeof content !== "string") {
      return NextResponse.json({ error: "content must be a string" }, { status: 400 });
    }
    const result = await remark()
      .use(remarkGfm)
      .use(remarkHtml, { sanitize: false })
      .process(content);
    return NextResponse.json({ html: result.toString() });
  } catch {
    return NextResponse.json({ error: "Preview failed" }, { status: 500 });
  }
}
