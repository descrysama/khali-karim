import { NextResponse } from "next/server";
import { applyFilters, parseFilters } from "@/lib/filter";
import type { ListingsPage } from "@/lib/types";

export const PAGE_SIZE = 9;

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters = parseFilters(searchParams);
  const page = Math.max(0, Number(searchParams.get("page") ?? 0) || 0);

  const all = applyFilters(filters);
  const start = page * PAGE_SIZE;
  const items = all.slice(start, start + PAGE_SIZE);
  const nextPage = start + PAGE_SIZE < all.length ? page + 1 : null;

  const body: ListingsPage = {
    items,
    total: all.length,
    page,
    nextPage,
  };
  return NextResponse.json(body);
}
