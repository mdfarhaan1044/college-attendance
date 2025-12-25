import { NextResponse } from "next/server";
import { createStudentAttendance } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { StudentID, Date, Status, CheckInTime } = body;

    if (!StudentID || !Date || !Status) {
      return NextResponse.json(
        { message: "StudentID, Date, and Status are required" },
        { status: 400 }
      );
    }

    const record = await createStudentAttendance({
      StudentID: Number(StudentID),
      Date: new Date(Date),
      Status,
      CheckInTime: CheckInTime ? new Date(CheckInTime) : null,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Failed to create student attendance", error);
    return NextResponse.json(
      { message: "Unable to create student attendance" },
      { status: 500 }
    );
  }
}

