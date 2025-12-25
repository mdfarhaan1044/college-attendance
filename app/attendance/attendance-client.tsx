"use client";

import { useState, useMemo } from "react";

type Option = {
  id: number;
  name: string;
  branch: string | null;
};

type AttendanceRecord = {
  id: number;
  status: "Present" | "Absent";
  time: string;
  isLate?: boolean;
};

export default function AttendancePage({
  teachers = [],
  students = [],
}: {
  teachers?: Option[];
  students?: Option[];
}) {
  // Safe init with fallback
  const [teacherAttendance, setTeacherAttendance] = useState<AttendanceRecord[]>(
    (teachers ?? []).map((t) => ({ id: t.id, status: "Absent", time: "", isLate: false }))
  );

  const [studentAttendance, setStudentAttendance] = useState<AttendanceRecord[]>(
    (students ?? []).map((s) => ({ id: s.id, status: "Absent", time: "" }))
  );

  const [teacherFilter, setTeacherFilter] = useState<string>("All");
  const [studentFilter, setStudentFilter] = useState<string>("All");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [message, setMessage] = useState<string | null>(null);

  const filteredTeachers = useMemo(() => {
    return teacherFilter === "All"
      ? teacherAttendance
      : teacherAttendance.filter(
        (a) => teachers.find((t) => t.id === a.id)?.branch === teacherFilter
      );
  }, [teacherFilter, teacherAttendance, teachers]);

  const filteredStudents = useMemo(() => {
    return studentFilter === "All"
      ? studentAttendance
      : studentAttendance.filter(
        (a) => students.find((s) => s.id === a.id)?.branch === studentFilter
      );
  }, [studentFilter, studentAttendance, students]);

  const branches = useMemo(() => {
    return ["All", ...new Set((teachers ?? []).map((t) => t.branch).filter((b): b is string => !!b))];
  }, [teachers]);


  const departments = useMemo(() => {
    return ["All", ...new Set((students ?? []).map((s) => s.branch).filter((b): b is string => !!b))];
  }, [students]);


  const toggleTeacher = (id: number, checked: boolean) => {
    setTeacherAttendance((list) =>
      list.map((a) =>
        a.id === id
          ? { ...a, status: checked ? "Present" : "Absent" }
          : a
      )
    );
  };

  const toggleStudent = (id: number, checked: boolean) => {
    setStudentAttendance((list) =>
      list.map((a) =>
        a.id === id
          ? { ...a, status: checked ? "Present" : "Absent" }
          : a
      )
    );
  };

  const submitTeacherAttendance = async () => {
    try {
      setMessage("Saving teacher attendance...");
      await Promise.all(
        teacherAttendance.map((a) =>
          fetch("/api/attendance/teacher", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              TeacherID: a.id,
              Date: date,
              Status: a.status,
              CheckInTime: a.time ? `${date}T${a.time}:00` : null,
              IsLate: a.isLate,
            }),
          })
        )
      );
      setMessage("Teacher attendance saved!");
    } catch {
      setMessage("Failed to save teacher attendance");
    }
  };

  const submitStudentAttendance = async () => {
    try {
      setMessage("Saving student attendance...");
      await Promise.all(
        studentAttendance.map((a) =>
          fetch("/api/attendance/student", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              StudentID: a.id, // matches your API
              Date: date,
              Status: a.status,
              CheckInTime: a.time ? `${date}T${a.time}:00` : null,
            }),
          })
        )
      );
      setMessage("Student attendance saved!");
    } catch {
      setMessage("Failed to save student attendance");
    }
  };

  return (
    <main className="mx-auto max-w-[1400px] p-8">
      {/* HEADER */}
      <h1 className="text-center text-5xl font-black bg-gradient-to-r from-slate-900 via-indigo-700 to-slate-900 bg-clip-text text-transparent mb-12 drop-shadow-lg animate-float">
        Attendance
      </h1>

      {/* DATE PICKER */}
      <div className="flex justify-center mb-14">
        <input
          type="date"
          className="px-6 py-3 rounded-2xl border border-slate-300 bg-white/60 backdrop-blur-md shadow-xl text-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* GRID: TEACHERS | STUDENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* TEACHERS */}
        <div className="group bg-white/40 backdrop-blur-lg border border-white/50 rounded-[28px] p-7 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-500 animate-float">
          <h2 className="text-2xl font-extrabold mb-4 text-slate-900">
            Filter Teachers
          </h2>
          <select
            value={teacherFilter}
            onChange={(e) => setTeacherFilter(e.target.value)}
            className="w-full mb-7 px-4 py-3 rounded-2xl border border-slate-400 bg-white/70 font-semibold text-slate-800 shadow-md hover:shadow-lg transition"
          >
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <h3 className="text-4xl font-black mb-6 text-slate-900">Teachers</h3>

          <div className="space-y-5">
            {filteredTeachers.map((a) => {
              const teacher = teachers.find((t) => t.id === a.id);
              return (
                <div
                  key={a.id}
                  className="flex justify-between items-center bg-white/70 rounded-2xl border border-slate-200 px-5 py-4 shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">{teacher?.name}</p>
                    <p className="text-xs font-semibold text-slate-500">{teacher?.branch || "No Branch"}</p>
                  </div>

                  {/* SLIDER */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={a.status === "Present"}
                      onChange={(e) => toggleTeacher(a.id, e.target.checked)}
                    />
                    <div className="w-14 h-7 bg-slate-300 rounded-full peer-checked:bg-slate-900 transition-all duration-300 peer-focus:ring-4 peer-focus:ring-slate-400/40"></div>
                    <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-7 transition-all duration-300 peer-checked:animate-bounce"></div>
                  </label>
                </div>
              );
            })}
          </div>

          <button
            onClick={submitTeacherAttendance}
            className="mt-10 w-full py-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-800 text-white text-xl font-black shadow-xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-500"
          >
            Submit
          </button>
        </div>

        {/* STUDENTS */}
        <div className="group bg-white/40 backdrop-blur-lg border border-white/50 rounded-[28px] p-7 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-500 animate-float">
          <h2 className="text-2xl font-extrabold mb-4 text-slate-900">
            Filter Students
          </h2>
          <select
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
            className="w-full mb-7 px-4 py-3 rounded-2xl border border-slate-400 bg-white/70 font-semibold text-slate-800 shadow-md hover:shadow-lg transition"
          >
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <h3 className="text-4xl font-black mb-6 text-slate-900">Students</h3>

          <div className="space-y-5">
            {filteredStudents.map((a) => {
              const student = students.find((s) => s.id === a.id);
              return (
                <div
                  key={a.id}
                  className="flex justify-between items-center bg-white/70 rounded-2xl border border-slate-200 px-5 py-4 shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">{student?.name}</p>
                    <p className="text-xs font-semibold text-slate-500">{student?.branch || "No Branch"}</p>
                  </div>

                  {/* SLIDER */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={a.status === "Present"}
                      onChange={(e) => toggleStudent(a.id, e.target.checked)}
                    />
                    <div className="w-14 h-7 bg-slate-300 rounded-full peer-checked:bg-slate-900 transition-all duration-300 peer-focus:ring-4 peer-focus:ring-slate-400/40"></div>
                    <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-7 transition-all duration-300 peer-checked:animate-bounce"></div>
                  </label>
                </div>
              );
            })}
          </div>

          <button
            onClick={submitStudentAttendance}
            className="mt-10 w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-800 to-slate-900 text-white text-xl font-black shadow-xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-500"
          >
            Submit
          </button>
        </div>
      </div>

      {/* MESSAGE */}
      {message && (
        <p className="text-center text-xl font-bold text-indigo-700 mt-10 animate-pulse">
          {message}
        </p>
      )}
    </main>
  );


}
