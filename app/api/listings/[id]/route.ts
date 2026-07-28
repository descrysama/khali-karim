import { NextResponse } from "next/server";
import { getListing, getSimilar } from "@/lib/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const listing = await getListing(id);
    if (!listing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    const similar = await getSimilar(id);
    return NextResponse.json({ listing, similar });
  } catch {
    return NextResponse.json(
      { error: "backend_unavailable" },
      { status: 502 }
    );
  }
}
