import { NextResponse } from "next/server";
import { opcIndustries } from "@/server/api-data";

export async function GET() {
  return NextResponse.json({ items: opcIndustries });
}
