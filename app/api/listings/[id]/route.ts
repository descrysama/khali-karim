import { NextResponse } from "next/server";
import { getListing, LISTINGS } from "@/lib/listings";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const similar = LISTINGS.filter(
    (it) =>
      it.id !== listing.id &&
      it.type === listing.type &&
      it.transaction === listing.transaction
  ).slice(0, 3);

  return NextResponse.json({ listing, similar });
}
