import { getStudents } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <main className="mx-auto max-w-[1400px] p-8 animate-float">
      <h1 className="text-center text-5xl font-black bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-transparent mb-10 drop-shadow-lg">
        Students
      </h1>

      <div className="overflow-hidden bg-white/40 backdrop-blur-lg border border-white/50 rounded-[28px] shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-black/70 text-white text-sm font-bold">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Branch</th>
              <th className="p-4">Year</th>
              <th className="p-4">Section</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.length ? students.map(s => (
              <tr key={s.StudentID} className="border-b border-slate-200 hover:bg-white/60 transition">
                <td className="p-4 font-bold">{s.FirstName} {s.LastName}</td>
                <td className="p-4">{s.Email ?? "—"}</td>
                <td className="p-4">{s.Branch ?? "—"}</td>
                <td className="p-4">{s.Year ? `Year ${s.Year}` : "—"}</td>
                <td className="p-4">{s.Section ?? "—"}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md">
                    {s.Status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="p-6 text-center text-slate-600 font-bold">No students found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
