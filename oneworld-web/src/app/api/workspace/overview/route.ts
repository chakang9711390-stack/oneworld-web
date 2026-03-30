import { NextResponse } from "next/server";
import { workspaceOverview } from "@/server/api-data";

export async function GET() {
  return NextResponse.json(workspaceOverview);
}
