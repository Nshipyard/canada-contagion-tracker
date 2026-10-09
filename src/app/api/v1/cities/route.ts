import { NextResponse } from "next/server";
import { getData } from "@/lib/contagion";

export async function GET() {
  const d = getData();
  return NextResponse.json({ cities: d.cities, source: d.meta.sources });
}
