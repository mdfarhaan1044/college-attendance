import Link from "next/link";
import { getStudents, getTeachers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [teachers, students] = await Promise.all([
    getTeachers(),
    getStudents(),
  ]);

  return (
    <main className="mx-auto max-w-[1500px] px-6 py-12 space-y-16 animate-float">
      {/* Header */}
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-slate-500 mb-3">
          College Attendance
        </p>
        <h1 className="text-6xl font-black bg-gradient-to-r from-slate-900 via-blue-700 to-slate-900 bg-clip-text text-transparent drop-shadow-lg">
          Dashboard
        </h1>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-5">
        <Link
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-black to-blue-800 text-white font-bold text-lg shadow-xl hover:scale-110 transition-all"
          href="/attendance"
        >
          Mark Attendance
        </Link>
        <Link
          className="px-6 py-3 rounded-2xl border-2 border-black text-black font-bold text-lg shadow-md hover:bg-black hover:text-white hover:scale-105 transition-all"
          href="/teachers"
        >
          View Teachers
        </Link>
        <Link
          className="px-6 py-3 rounded-2xl border-2 border-black text-black font-bold text-lg shadow-md hover:bg-black hover:text-white hover:scale-105 transition-all"
          href="/students"
        >
          View Students
        </Link>
      </div>

      {/* Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Teachers Card */}
        <GlassCard title="Teachers" subtitle="Top 5 preview">
          <PreviewList
            items={teachers.slice(0, 5).map(t => ({
              id: t.TeacherID,
              title: `${t.FirstName} ${t.LastName}`,
              subtitle: t.Email ?? "No email set",
              meta: t.Subject ?? t.Branch ?? "No subject set"
            }))}
            emptyText="No teachers found."
          />
        </GlassCard>

        {/* Students Card */}
        <GlassCard title="Students" subtitle="Top 5 preview">
          <PreviewList
            items={students.slice(0, 5).map(s => ({
              id: s.StudentID,
              title: `${s.FirstName} ${s.LastName}`,
              subtitle: s.Email ?? "No email set",
              meta: s.Branch && s.Year
                ? `${s.Branch} • Year ${s.Year}${s.Section ? ` • ${s.Section}` : ""}`
                : s.Branch ?? "No branch set"
            }))}
            emptyText="No students found."
          />
        </GlassCard>

      </div>
    </main>
  );
}

function GlassCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/30 border border-white/50 backdrop-blur-lg p-6 rounded-[30px] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all">
      <h2 className="text-4xl font-black text-slate-900 mb-2">{title}</h2>
      <p className="text-sm font-semibold text-slate-600 mb-5">{subtitle}</p>
      {children}
    </div>
  );
}

function PreviewList({ items, emptyText }: { items: any[]; emptyText: string }) {
  if (!items.length) return <p className="text-sm text-slate-500">{emptyText}</p>;

  return (
    <ul className="space-y-4">
      {items.map(item => (
        <li key={item.id} className="p-4 bg-slate-100/70 border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition">
          <div className="flex justify-between">
            <p className="font-bold text-slate-900">{item.title}</p>
            <p className="text-xs text-slate-500">ID: {item.id}</p>
          </div>
          <p className="text-sm text-slate-700">{item.subtitle}</p>
          {item.meta && <p className="text-xs font-medium text-blue-700 mt-1">{item.meta}</p>}
        </li>
      ))}
    </ul>
  );
}

/* Floating Animation */
const style = `
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}
.animate-float {
  animation: float 5s ease-in-out infinite;
}`;
