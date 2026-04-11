import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../config";
import type { ReviewAssignment, ReviewUser } from "../types";

const normalizeAssignmentStatus = (status: string) => {
  const value = status?.toUpperCase().trim();
  if (value === "IN REVIEW" || value === "IN_REVIEW") return "IN_REVIEW";
  if (value === "COMPLETED") return "COMPLETED";
  if (value === "CANCELLED") return "CANCELLED";
  if (value === "OPEN") return "OPEN";
  return "ASSIGNED";
};


export default function SubmissionReviews() {
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [reviewRows, setReviewRows] = useState<ReviewAssignment[]>([]);
  const [userMap, setUserMap] = useState<Record<string, ReviewUser>>({});
  const [search, setSearch] = useState("");
  const [actionLoadingById, setActionLoadingById] = useState<Record<string, boolean>>({});
  const [moderatorId, setModeratorId] = useState<string | null>(null);

  const setRowLoading = (assignmentId: string, isLoadingRow: boolean) => {
    setActionLoadingById((prev) => ({ ...prev, [assignmentId]: isLoadingRow }));
  };

  const getTaskFromRelation = (tasks: ReviewAssignment["tasks"]) => {
    if (!tasks) return undefined;
    return Array.isArray(tasks) ? tasks[0] : tasks;
  };

  const loadReviewData = async () => {
    if (!moderatorId) return;

    const { data, error } = await supabase
      .from("task_assignments")
      .select("id, task_id, user_id, status, assigned_at, submission_url, tasks(title, category, points, drive_folder_url)")
      .order("assigned_at", { ascending: false });

    if (error) throw error;

    const assignments = ((data as ReviewAssignment[]) || []).filter(
      (row) => normalizeAssignmentStatus(row.status) === "IN_REVIEW"
    );
    setReviewRows(assignments);

    const userIds = Array.from(new Set(assignments.map((assignment) => assignment.user_id)));
    if (userIds.length === 0) {
      setUserMap({});
      return;
    }

    const { data: userRows, error: userError } = await supabase
      .from("users")
      .select("id, first_name, last_name, email, college_roll")
      .in("id", userIds);

    if (userError) throw userError;

    const nextUserMap = ((userRows as ReviewUser[]) || []).reduce<Record<string, ReviewUser>>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    setUserMap(nextUserMap);
  };

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          setForbidden(true);
          return;
        }

        const { data: roleRow, error: roleError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (roleError) throw roleError;

        if (roleRow?.role !== "MODERATOR") {
          setForbidden(true);
          return;
        }

        setModeratorId(user.id);
      } catch (err) {
        console.error(err);
        toast.error("Failed to open submission review queue.");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const fetchQueue = async () => {
      if (!moderatorId) return;
      setLoading(true);
      try {
        await loadReviewData();
      } catch (err) {
        console.error(err);
        toast.error("Failed to load review queue.");
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, [moderatorId]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return reviewRows;

    return reviewRows.filter((assignment) => {
      const reviewerUser = userMap[assignment.user_id];
      const task = getTaskFromRelation(assignment.tasks);
      const fullName = `${reviewerUser?.first_name || ""} ${reviewerUser?.last_name || ""}`.trim().toLowerCase();
      const email = (reviewerUser?.email || "").toLowerCase();
      const roll = (reviewerUser?.college_roll || "").toLowerCase();
      const taskTitle = (task?.title || "").toLowerCase();
      return fullName.includes(query) || email.includes(query) || roll.includes(query) || taskTitle.includes(query);
    });
  }, [reviewRows, userMap, search]);

  const handleApprove = async (assignment: ReviewAssignment) => {
    if (!moderatorId) return;

    const task = getTaskFromRelation(assignment.tasks);
    const awardedPoints = task?.points ?? 0;
    setRowLoading(assignment.id, true);

    try {
      const { data: assignmentUpdateRows, error: updateAssignmentError } = await supabase
        .from("task_assignments")
        .update({ status: "COMPLETED", reviewed_by: moderatorId, completed_at: new Date().toISOString() })
        .eq("id", assignment.id)
        .eq("status", assignment.status)
        .select("id");

      console.log("Assignment update result:", { assignmentUpdateRows, updateAssignmentError });

      if (updateAssignmentError) throw updateAssignmentError;

      if (!assignmentUpdateRows || assignmentUpdateRows.length === 0) {
        throw new Error("This submission was already reviewed by another moderator.");
      }

      let pointsAwarded = false;
      if (awardedPoints > 0) {
        const { data: pointsRow, error: pointsReadError } = await supabase
          .from("users")
          .select("points")
          .eq("id", assignment.user_id)
          .single();

        const missingPointsColumn =
          String(pointsReadError?.message || "").toLowerCase().includes("column") &&
          String(pointsReadError?.message || "").toLowerCase().includes("points");

        if (!pointsReadError) {
          const currentPoints = Number((pointsRow as { points?: number } | null)?.points ?? 0);
          const { error: pointsUpdateError } = await supabase
            .from("users")
            .update({ points: currentPoints + awardedPoints })
            .eq("id", assignment.user_id);

          if (!pointsUpdateError) {
            pointsAwarded = true;
          } else {
            console.error(pointsUpdateError);
          }
        } else if (!missingPointsColumn) {
          console.error(pointsReadError);
        }
      }

      await loadReviewData();
      if (awardedPoints > 0 && pointsAwarded) {
        toast.success("Submission approved and points awarded.");
      } else if (awardedPoints > 0) {
        toast.success("Submission approved. Points could not be awarded right now.");
      } else {
        toast.success("Submission approved.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to approve submission.");
    } finally {
      setRowLoading(assignment.id, false);
    }
  };

  const handleReject = async (assignment: ReviewAssignment) => {
    if (!moderatorId) return;

    setRowLoading(assignment.id, true);
    try {
      const { data, error } = await supabase
        .from("task_assignments")
        .update({ status: "CANCELLED", reviewed_by: moderatorId })
        .eq("id", assignment.id)
        .eq("status", assignment.status)
        .select("id");

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("This submission was already reviewed by another moderator.");
      }

      await loadReviewData();
      toast.success("Submission rejected.");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to reject submission.");
    } finally {
      setRowLoading(assignment.id, false);
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-up">
        <div className="mb-9">
          <div className="w-7 h-0.5 bg-[var(--amber)] rounded-[1px] mb-3" />
          <h1 className="font-['Playfair_Display',_serif] text-4xl font-bold text-[var(--obsidian)] tracking-[-0.02em]">
            Submission Reviews
          </h1>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-[162px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="bg-white border border-[var(--cream-border)] rounded-xl p-6 text-[var(--text-muted)]">
        This page is only available for moderators.
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-9">
        <div className="w-7 h-0.5 bg-[var(--amber)] rounded-[1px] mb-3" />
        <h1 className="font-['Playfair_Display',_serif] text-4xl font-bold text-[var(--obsidian)] tracking-[-0.02em] mb-1.5">
          Submission Reviews
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Verify member deliverables and award points after approval.
        </p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by member name, roll, email, or task title"
          className="w-full rounded-lg border border-[var(--cream-border)] bg-white px-3 py-2 text-sm"
        />
      </div>

      {filteredRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 bg-white border border-[var(--cream-border)] rounded-2xl text-[var(--text-muted)]">
          <p className="text-sm font-medium">No submissions pending review</p>
          <p className="text-xs mt-1">Work submitted by members will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRows.map((assignment) => {
            const member = userMap[assignment.user_id];
            const isBusy = !!actionLoadingById[assignment.id];
            const task = getTaskFromRelation(assignment.tasks);
            const points = task?.points ?? 0;

            return (
              <div key={assignment.id} className="bg-white border border-[var(--cream-border)] rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-[var(--obsidian)]">
                      {task?.title || `Task ${assignment.task_id}`}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                      <span>{member ? `${member.first_name || ""} ${member.last_name || ""}`.trim() : "Unknown Member"}</span>
                      {member?.college_roll && <span>Roll: {member.college_roll}</span>}
                      {member?.email && <span>{member.email}</span>}
                      {task?.category && <span>Category: {task.category}</span>}
                      <span>Points: {points}</span>
                    </div>
                    <p className="mt-2 text-xs text-[var(--text-muted)]">
                      Assigned: {new Date(assignment.assigned_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#F5F3FF] text-[#5A42A5]">
                    IN REVIEW
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="rounded-lg border border-[var(--cream-border)] bg-[var(--cream)] px-3 py-2">
                    <p className="text-xs font-semibold text-[var(--obsidian)]">Submitted Link</p>
                    {assignment.submission_url ? (
                      <a
                        href={assignment.submission_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-xs text-blue-600 hover:underline break-all"
                      >
                        {assignment.submission_url}
                      </a>
                    ) : (
                      <p className="mt-1 text-xs text-[var(--text-muted)]">No link provided.</p>
                    )}
                  </div>

                  <div className="rounded-lg border border-[var(--cream-border)] bg-[var(--cream)] px-3 py-2">
                    <p className="text-xs font-semibold text-[var(--obsidian)]">Task Drive Folder</p>
                    {task?.drive_folder_url ? (
                      <a
                        href={task.drive_folder_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-xs text-blue-600 hover:underline break-all"
                      >
                        {task.drive_folder_url}
                      </a>
                    ) : (
                      <p className="mt-1 text-xs text-[var(--text-muted)]">No task folder configured.</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(assignment)}
                    disabled={isBusy}
                    className="px-3 py-2 rounded-lg text-xs font-semibold border-none cursor-pointer bg-[#2D7A4A] text-white hover:opacity-90 disabled:opacity-60"
                  >
                    {isBusy ? "Processing..." : `Approve (+${points} pts)`}
                  </button>
                  <button
                    onClick={() => handleReject(assignment)}
                    disabled={isBusy}
                    className="px-3 py-2 rounded-lg text-xs font-semibold border border-[#F3D1D1] cursor-pointer bg-[#FDEEEE] text-[#A63B3B] hover:opacity-90 disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
