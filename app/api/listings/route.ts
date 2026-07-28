import { NextResponse } from "next/server";
import { getListings } from "@/lib/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const page = await getListings({
      q: searchParams.get("q") ?? undefined,
      region: searchParams.get("region") ?? undefined,
      transaction: searchParams.get("transaction") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      budget: searchParams.get("budget") ?? undefined,
      rooms: searchParams.get("rooms") ?? undefined,
      surfaceMin: searchParams.get("surfaceMin") ?? undefined,
      dpeMax: searchParams.get("dpeMax") ?? undefined,
      exterior: searchParams.get("exterior") === "1",
      elevator: searchParams.get("elevator") === "1",
      sort: searchParams.get("sort") ?? undefined,
      page: Number(searchParams.get("page") ?? 0) || 0,
    });
    return NextResponse.json(page);
  } catch {
    return NextResponse.json(
      { error: "backend_unavailable" },
      { status: 502 }
    );
  }
}
