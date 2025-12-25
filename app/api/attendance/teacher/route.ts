import { NextResponse } from "next/server";
import { createTeacherAttendance } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { TeacherID, Date, Status, CheckInTime, IsLate } = body;

    if (!TeacherID || !Date || !Status) {
      return NextResponse.json(
        { message: "TeacherID, Date, and Status are required" },
        { status: 400 }
      );
    }

    const record = await createTeacherAttendance({
      TeacherID: Number(TeacherID),
      Date: new Date(Date),
      Status,
      CheckInTime: CheckInTime ? new Date(CheckInTime) : null,
      IsLate: Boolean(IsLate),
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Failed to create teacher attendance", error);
    return NextResponse.json(
      { message: "Unable to create teacher attendance" },
      { status: 500 }
    );
  }
}

