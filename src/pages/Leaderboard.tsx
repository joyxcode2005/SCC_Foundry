import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import EmptyState from "../components/EmptyState";
import { supabase } from "../config";
import { medalBg, medalEmoji } from "../config/constants";
import type { Student } from "../types";

type LeaderboardUserRow = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  department: string | null;
  total_points: number | string | null;
};

export default function Leaderboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchLeaderboard = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      const currentUserId = user?.id ?? null;

      const { data, error } = await supabase
        .from("leaderboard")
        .select("user_id, first_name, last_name, department, total_points");

      if (!active) {
        return;
      }

      if (error || !data) {
        toast.error("Failed to load leaderboard data.");
        setStudents([]);
        setLoading(false);
        return;
      }

      const rankedStudents = (data as LeaderboardUserRow[])
        .map((row) => {
          const firstName = (row.first_name ?? "").trim();
          const lastName = (row.last_name ?? "").trim();
          const fullName = `${firstName} ${lastName}`.trim() || "Unknown Student";
          const pointsValue = Number(row.total_points ?? 0);

          return {
            id: row.user_id,
            name: fullName,
            department: (row.department ?? "-").trim() || "-",
            points: Number.isFinite(pointsValue) ? pointsValue : 0,
            isYou: currentUserId === row.user_id,
          };
        })
        .sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points;
          }

          return a.name.localeCompare(b.name);
        })
        .map((student, index) => ({
          rank: index + 1,
          name: student.name,
          roll: "-",
          department: student.department,
          points: student.points,
          isYou: student.isYou,
        }));

      setStudents(rankedStudents);
      setLoading(false);
    };

    fetchLeaderboard();

    return () => {
      active = false;
    };
  }, []);

  const top3 = students.slice(0, 3);
  const rest = students.slice(3);



  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-10">
        <div className="w-7 h-0.5 bg-[var(--amber)] rounded-sm mb-3" />
        <h1 className="font-['Playfair_Display',_serif] text-4xl font-bold text-[var(--obsidian)] tracking-tight mb-2">
          Leaderboard
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Top performing students ranked by total points.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="foundry-card">
          <EmptyState />
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {top3.length > 0 && (
            <div className="animate-fade-up-delay-1 grid grid-cols-3 gap-3 mb-8">
              {[top3[1], top3[0], top3[2]].filter(Boolean).map((s, i) => {
                const isCenter = i === 1;
                return (
                  <div
                    key={s.rank}
                    className={`relative overflow-hidden rounded-2xl p-6 text-center border ${isCenter
                      ? 'bg-[var(--obsidian)] border-[var(--obsidian)] shadow-lg mt-0'
                      : 'bg-white border-[var(--cream-border)] shadow-sm mt-4'
                      }`}
                  >
                    {isCenter && <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--amber)]" />}

                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-lg ${isCenter ? 'bg-[#faf8f3]/10' : ''
                        }`}
                      style={!isCenter ? { background: medalBg[s.rank] || 'var(--cream)' } : {}}
                    >
                      {medalEmoji[s.rank]}
                    </div>

                    <p className={`text-sm font-semibold mb-1 ${isCenter ? 'text-[var(--cream)]' : 'text-[var(--obsidian)]'}`}>
                      {s.name}
                    </p>

                    <p className={`font-['Playfair_Display',_serif] text-2xl font-bold ${isCenter ? 'text-[var(--amber-light)]' : 'text-[var(--obsidian)]'}`}>
                      {s.points.toLocaleString()}
                    </p>
                    <p className={`text-[11px] ${isCenter ? 'text-[#faf8f3]/40' : 'text-[var(--text-muted)]'}`}>
                      points
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Rest of table */}
          {rest.length > 0 && (
            <div className="animate-fade-up-delay-2 foundry-card overflow-hidden">
              <div className="grid grid-cols-[48px_1fr_120px_100px] py-3 px-6 border-b border-[var(--cream-border)] bg-[var(--cream)]">
                {['Rank', 'Student', 'Department', 'Points'].map(h => (
                  <span key={h} className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--text-muted)]">
                    {h}
                  </span>
                ))}
              </div>

              {rest.map((student, i) => (
                <div
                  key={student.rank}
                  className={`grid grid-cols-[48px_1fr_120px_100px] py-4 px-6 items-center ${i < rest.length - 1 ? 'border-b border-[var(--cream-border)]' : ''
                    } ${student.isYou ? 'bg-[var(--amber-pale)]' : 'bg-white'
                    }`}
                >
                  <div className="w-7 h-7 rounded-md bg-[var(--cream)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)]">
                    {student.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--obsidian)]">{student.name}</span>
                      {student.isYou && <span className="foundry-badge badge-amber">You</span>}
                    </div>
                  </div>
                  <span className="text-[13px] text-[var(--text-secondary)]">{student.department}</span>
                  <span className={`font-['Playfair_Display',_serif] text-base font-semibold ${student.isYou ? 'text-[var(--amber)]' : 'text-[var(--obsidian)]'}`}>
                    {student.points.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}