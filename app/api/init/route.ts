import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TEACHER_COUNT = 20;
const STUDENT_COUNT = 100;
const TEACHER_ATTENDANCE_COUNT = 10_000;
const STUDENT_ATTENDANCE_COUNT = 50_000;
const ATTENDANCE_DAYS_RANGE = 120;

const firstNames = [
  "Aarav",
  "Ishaan",
  "Riya",
  "Kavya",
  "Arjun",
  "Meera",
  "Vihaan",
  "Anaya",
  "Rohan",
  "Sanya",
];

const lastNames = [
  "Sharma",
  "Patel",
  "Reddy",
  "Nair",
  "Khan",
  "Singh",
  "Verma",
  "Das",
  "Ghosh",
  "Iyer",
];

const branches = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AI/ML"];
const subjects = [
  "Data Structures",
  "Algorithms",
  "Thermodynamics",
  "Signals",
  "Networks",
  "OS",
  "DBMS",
  "Maths",
  "Physics",
  "Chemistry",
];

const qualifications = ["B.Tech", "M.Tech", "PhD", "MSc"];

const sections = ["A", "B", "C", "D"];

const randomItem = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function randomDateWithin(days: number) {
  const now = Date.now();
  const past = now - days * 24 * 60 * 60 * 1000;
  return new Date(randomInt(past, now));
}

async function chunkedCreateMany<T>(
  model: { createMany: (args: { data: T[] }) => Promise<unknown> },
  data: T[],
  chunkSize = 1_000
) {
  for (let i = 0; i < data.length; i += chunkSize) {
    const slice = data.slice(i, i + chunkSize);
    await model.createMany({ data: slice });
  }
}

export async function GET() {
  try {
    // Clean existing data to avoid unique conflicts.
    await prisma.teacherAttendance.deleteMany();
    await prisma.studentAttendance.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.student.deleteMany();

    // Seed teachers.
    const teachersData = Array.from({ length: TEACHER_COUNT }, (_, i) => {
      const first = randomItem(firstNames);
      const last = randomItem(lastNames);
      return {
        FirstName: first,
        LastName: last,
        Gender: Math.random() > 0.5 ? "Male" : "Female",
        DOB: randomDateWithin(365 * 30),
        Email: `teacher${i + 1}@college.test`,
        Phone: `90000${String(10000 + i).slice(-5)}`,
        Address: "Campus Housing",
        Branch: randomItem(branches),
        Subject: randomItem(subjects),
        Qualification: randomItem(qualifications),
        ExperienceYears: randomInt(1, 20),
        Salary: randomInt(40000, 120000),
        JoinDate: randomDateWithin(365 * 5),
        Status: "Active",
      };
    });
    await prisma.teacher.createMany({ data: teachersData });
    const teachers = await prisma.teacher.findMany({
      select: { TeacherID: true },
    });
    const teacherIds = teachers.map((t: { TeacherID: number }) => t.TeacherID);

    // Seed students.
    const studentsData = Array.from({ length: STUDENT_COUNT }, (_, i) => {
      const first = randomItem(firstNames);
      const last = randomItem(lastNames);
      return {
        FirstName: first,
        LastName: last,
        Gender: Math.random() > 0.5 ? "Male" : "Female",
        DOB: randomDateWithin(365 * 22),
        Email: `student${i + 1}@college.test`,
        Phone: `80000${String(10000 + i).slice(-5)}`,
        Address: "Dormitory",
        Branch: randomItem(branches),
        Year: randomInt(1, 4),
        Section: randomItem(sections),
        RollNumber: i + 1,
        AdmissionDate: randomDateWithin(365 * 4),
        ParentName: "Parent " + (i + 1),
        ParentPhone: `70000${String(10000 + i).slice(-5)}`,
        ParentEmail: `parent${i + 1}@mail.test`,
        Status: "Active",
      };
    });
    await prisma.student.createMany({ data: studentsData });
    const students = await prisma.student.findMany({
      select: { StudentID: true },
    });
    const studentIds = students.map(
      (s: { StudentID: number }) => s.StudentID
    );

    // Seed teacher attendance.
    const teacherAttendanceData = Array.from(
      { length: TEACHER_ATTENDANCE_COUNT },
      () => {
        const date = randomDateWithin(ATTENDANCE_DAYS_RANGE);
        return {
          TeacherID: randomItem(teacherIds),
          Date: date,
          Status: Math.random() > 0.1 ? "Present" : "Absent",
          CheckInTime:
            Math.random() > 0.2
              ? new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                  randomInt(8, 11),
                  randomInt(0, 59),
                  0
                )
              : null,
          IsLate: Math.random() > 0.85,
        };
      }
    );
    await chunkedCreateMany(prisma.teacherAttendance, teacherAttendanceData);

    // Seed student attendance.
    const studentAttendanceData = Array.from(
      { length: STUDENT_ATTENDANCE_COUNT },
      () => {
        const date = randomDateWithin(ATTENDANCE_DAYS_RANGE);
        return {
          StudentID: randomItem(studentIds),
          Date: date,
          Status: Math.random() > 0.15 ? "Present" : "Absent",
          CheckInTime:
            Math.random() > 0.25
              ? new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                  randomInt(7, 10),
                  randomInt(0, 59),
                  0
                )
              : null,
        };
      }
    );
    await chunkedCreateMany(prisma.studentAttendance, studentAttendanceData);

    return NextResponse.json({
      teachers: TEACHER_COUNT,
      students: STUDENT_COUNT,
      teacherAttendance: TEACHER_ATTENDANCE_COUNT,
      studentAttendance: STUDENT_ATTENDANCE_COUNT,
      message: "Mock data inserted",
    });
  } catch (error) {
    console.error("Failed to seed mock data", error);
    return NextResponse.json(
      { message: "Unable to seed mock data" },
      { status: 500 }
    );
  }
}

