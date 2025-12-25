import { NextResponse } from "next/server";
import { getTeachers } from "@/lib/data";

export async function GET() {
  try {
    const teachers = await getTeachers();
    return NextResponse.json(teachers);
  } catch (error) {
    console.error("Failed to fetch teachers", error);
    return NextResponse.json(
      { message: "Unable to fetch teachers" },
      { status: 500 }
    );
  }
}

