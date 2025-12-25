import { getTeachers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function TeachersPage() {
  const teachers = await getTeachers();

  return (
    <main className="mx-auto max-w-[1400px] p-8 animate-float">
      <h1 className="text-center text-5xl font-black bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-transparent mb-10 drop-shadow-lg">
        Teachers
      </h1>

      <div className="overflow-hidden bg-white/40 backdrop-blur-lg border border-white/50 rounded-[28px] shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-black/70 text-white text-sm font-bold">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Branch</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length ? teachers.map(t => (
              <tr key={t.TeacherID} className="border-b border-slate-200 hover:bg-white/60 transition">
                <td className="p-4 font-bold">{t.FirstName} {t.LastName}</td>
                <td className="p-4">{t.Email ?? "—"}</td>
                <td className="p-4">{t.Subject ?? "—"}</td>
                <td className="p-4">{t.Branch ?? "—"}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md">
                    {t.Status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="p-6 text-center text-slate-600 font-bold">No teachers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
