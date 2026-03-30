import { NextResponse } from "next/server";
import { workflowIndustries } from "@/server/api-data";

export async function GET() {
  return NextResponse.json({ items: workflowIndustries });
}
