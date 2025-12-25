import { getStudents, getTeachers } from "@/lib/data";
import AttendancePageClient from "./attendance-client";

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const teachersData = await getTeachers();
  const studentsData = await getStudents();

  const teachers = teachersData.map((t) => ({
    id: t.TeacherID,
    name: `${t.FirstName} ${t.LastName}`,
    branch: t.Branch ?? "General",
  }));

  const students = studentsData.map((s) => ({
    id: s.StudentID,
    name: `${s.FirstName} ${s.LastName}`,
    branch: s.Branch ?? "General",
  }));

  return <AttendancePageClient teachers={teachers} students={students} />;
}
