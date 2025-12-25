import { prisma } from "./prisma";

export async function getTeachers() {
  return prisma.teacher.findMany({
    orderBy: { TeacherID: "asc" },
  });
}

export async function getStudents() {
  return prisma.student.findMany({
    orderBy: { StudentID: "asc" },
  });
}

export async function createTeacherAttendance(input: {
  TeacherID: number;
  Date: Date;
  Status: string;
  CheckInTime?: Date | null;
  IsLate?: boolean;
}) {
  return prisma.teacherAttendance.create({
    data: {
      TeacherID: input.TeacherID,
      Date: input.Date,
      Status: input.Status,
      CheckInTime: input.CheckInTime ?? null,
      IsLate: input.IsLate ?? false,
    },
  });
}

export async function createStudentAttendance(input: {
  StudentID: number;
  Date: Date;
  Status: string;
  CheckInTime?: Date | null;
}) {
  return prisma.studentAttendance.create({
    data: {
      StudentID: input.StudentID,
      Date: input.Date,
      Status: input.Status,
      CheckInTime: input.CheckInTime ?? null,
    },
  });
}

