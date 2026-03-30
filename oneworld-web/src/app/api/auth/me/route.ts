import { NextResponse } from "next/server";
import { currentUser } from "@/server/api-data";

export async function GET() {
  return NextResponse.json(currentUser);
}
