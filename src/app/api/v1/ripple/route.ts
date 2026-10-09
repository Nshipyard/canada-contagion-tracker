import { NextResponse } from "next/server";
import { getData } from "@/lib/contagion";

export async function GET() {
  return NextResponse.json(getData());
}
