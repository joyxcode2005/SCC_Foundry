import { useEffect, useState } from "react";
import { supabase } from "../config";
import toast from "react-hot-toast";

type AssignmentStatus = "OPEN" | "ASSIGNED" | "IN_REVIEW" | "COMPLETED" | "CANCELLED";

interface TaskAssignment {
  id: string;
  task_id: string;
  user_id: string;
  status: string;
  assigned_at: string;
  completed_at: string | null;
  submission_url: string | null;
  tasks?: {
    title: string;
    description?: string | null;
    category?: string | null;
    points?: number | null;
    deadline?: string | null;
    drive_folder_url?: string | null;
  } | Array<{
    title: string;
    description?: string | null;
    category?: string | null;
    points?: number | null;
    deadline?: string | null;
    drive_folder_url?: string | null;
  }>;
}

const statusStyles: Record<AssignmentStatus, string> = {
  OPEN: "bg-[#F3F4F6] text-[#4B5563]",
  ASSIGNED: "bg-[#FFF4DE] text-[#A16000]",
  IN_REVIEW: "bg-[#F5F3FF] text-[#5A42A5]",
  COMPLETED: "bg-[#E8F3EB] text-[#2D7A4A]",
  CANCELLED: "bg-[#FDEEEE] text-[#A63B3B]",
};

const normalizeAssignmentStatus = (status: string): AssignmentStatus => {
  const value = status?.toUpperCase().trim();
  if (value === "OPEN") return "OPEN";
  if (value === "IN REVIEW" || value === "IN_REVIEW") return "IN_REVIEW";
  if (value === "COMPLETED") return "COMPLETED";
  if (value === "CANCELLED") return "CANCELLED";
  return "ASSIGNED";
};

const statusLabel = (status: AssignmentStatus) => status.replace("_", " ");

const isAllowedSubmissionUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return ["drive.google.com", "docs.google.com"].includes(parsed.hostname);
  } catch {
    return false;
  }
};

export default function AssignedTasks() {
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [actionLoadingById, setActionLoadingById] = useState<Record<string, boolean>>({});
  const [submissionById, setSubmissionById] = useState<Record<string, string>>({});
  const [startedById, setStartedById] = useState<Record<string, boolean>>({});

  const loadAssignments = async (userId: string) => {
    const { data, error: dbError } = await supabase
      .from("task_assignments")
      .select("id, task_id, user_id, status, assigned_at, completed_at, submission_url, tasks(title, description, category, points, deadline, drive_folder_url)")
      .eq("user_id", userId)
      .order("assigned_at", { ascending: false });

    console.log("Fetched assignments:", data, "Error:", dbError);

    if (dbError) throw dbError;

    const nextAssignments = (data as TaskAssignment[]) || [];
    console.log("Normalized assignments:", nextAssignments);
    setAssignments(nextAssignments);
    setSubmissionById(
      nextAssignments.reduce<Record<string, string>>((acc, assignment) => {
        acc[assignment.id] = assignment.submission_url || "";
        return acc;
      }, {})
    );
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          setError("Please log in to view your tasks.");
          return;
        }

        setCurrentUserId(user.id);
        await loadAssignments(user.id);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load assigned tasks.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const setRowLoading = (assignmentId: string, isLoadingRow: boolean) => {
    setActionLoadingById((prev) => ({ ...prev, [assignmentId]: isLoadingRow }));
  };

  const getTaskFromRelation = (tasks: TaskAssignment["tasks"]) => {
    if (!tasks) return undefined;
    return Array.isArray(tasks) ? tasks[0] : tasks;
  };

  const handleStartTask = async (assignmentId: string) => {
    setStartedById((prev) => ({ ...prev, [assignmentId]: true }));
    toast.success("You can now submit your work link.");
  };

  const handleSubmitForReview = async (assignment: TaskAssignment) => {
    if (!currentUserId) return;

    const submissionUrl = submissionById[assignment.id]?.trim();
    if (!submissionUrl) {
      toast.error("Please paste your submission link.");
      return;
    }

    if (!isAllowedSubmissionUrl(submissionUrl)) {
      toast.error("Please submit a Google Drive or Google Docs link.");
      return;
    }

    setRowLoading(assignment.id, true);

    try {
      const { error: updateError } = await supabase
        .from("task_assignments")
        .update({ status: "IN_REVIEW", submission_url: submissionUrl })
        .eq("id", assignment.id)
        .eq("user_id", currentUserId)
        .eq("status", assignment.status);

      if (updateError) throw updateError;

      await loadAssignments(currentUserId);
      setStartedById((prev) => ({ ...prev, [assignment.id]: false }));
      toast.success("Submission sent for moderator review.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit your work.");
    } finally {
      setRowLoading(assignment.id, false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-fade-up">
        <div className="mb-9">
          <div className="w-7 h-0.5 bg-[var(--amber)] rounded-[1px] mb-3" />
          <h1 className="font-['Playfair_Display',_serif] text-4xl font-bold text-[var(--obsidian)] tracking-[-0.02em]">
            My Assigned Tasks
          </h1>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-[132px] rounded-xl w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="animate-fade-up">
      <div className="mb-9">
        <div className="w-7 h-0.5 bg-[var(--amber)] rounded-[1px] mb-3" />
        <h1 className="font-['Playfair_Display',_serif] text-4xl font-bold text-[var(--obsidian)] tracking-[-0.02em] mb-1.5">
          My Assigned Tasks
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Start assigned work, submit your Drive link, and track moderator verification.
        </p>
      </div>

      {assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 bg-white border border-[var(--cream-border)] rounded-2xl text-[var(--text-muted)]">
          <p className="text-sm font-medium">You have no assigned tasks yet</p>
          <p className="text-xs mt-1">Once a moderator assigns work, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment) => {
            const normalizedStatus = normalizeAssignmentStatus(assignment.status);
            const statusClass = statusStyles[normalizedStatus];
            const isRowLoading = !!actionLoadingById[assignment.id];
            const task = getTaskFromRelation(assignment.tasks);


            return (
              <div key={assignment.id} className="bg-white border border-[var(--cream-border)] rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-[var(--obsidian)]">
                      {task?.title || `Task ${assignment.task_id}`}
                    </h3>
                    {task?.description && (
                      <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                      <span>Assigned: {formatDate(assignment.assigned_at)}</span>
                      {task?.category && <span>Category: {task.category}</span>}
                      {task?.points != null && <span>Points: {task.points}</span>}
                      {task?.deadline && <span>Deadline: {formatDate(task.deadline)}</span>}
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 ${statusClass}`}>
                    {statusLabel(normalizedStatus)}
                  </span>
                </div>

                <div className="mt-4 rounded-lg border border-[var(--cream-border)] bg-[var(--cream)] px-3 py-2">
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
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      No folder link provided yet. Ask a moderator before submitting.
                    </p>
                  )}
                </div>

                {(normalizedStatus === "ASSIGNED" || normalizedStatus === "OPEN") && !startedById[assignment.id] && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleStartTask(assignment.id)}
                      className="btn-primary"
                    >
                      Start Task
                    </button>
                  </div>
                )}

                {(normalizedStatus === "ASSIGNED" || normalizedStatus === "OPEN") && startedById[assignment.id] && (
                  <div className="mt-4 space-y-2">
                    <label className="block text-xs font-semibold text-[var(--obsidian)]">
                      Submission Link (Google Drive or Google Docs)
                    </label>
                    <input
                      type="url"
                      value={submissionById[assignment.id] || ""}
                      onChange={(event) =>
                        setSubmissionById((prev) => ({
                          ...prev,
                          [assignment.id]: event.target.value,
                        }))
                      }
                      placeholder="https://drive.google.com/..."
                      className="w-full rounded-lg border border-[var(--cream-border)] px-3 py-2 text-sm"
                    />
                    <button
                      onClick={() => handleSubmitForReview(assignment)}
                      disabled={isRowLoading}
                      className="btn-primary disabled:opacity-60"
                    >
                      {isRowLoading ? "Submitting..." : "Submit for Review"}
                    </button>
                  </div>
                )}

                {(normalizedStatus === "IN_REVIEW" || normalizedStatus === "COMPLETED" || normalizedStatus === "CANCELLED") && (
                  <div className="mt-4 rounded-lg border border-[var(--cream-border)] bg-white px-3 py-2">
                    <p className="text-xs font-semibold text-[var(--obsidian)]">Submitted Work</p>
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
                      <p className="mt-1 text-xs text-[var(--text-muted)]">No submission link saved.</p>
                    )}

                    {normalizedStatus === "IN_REVIEW" && (
                      <p className="mt-2 text-xs text-[var(--text-muted)]">
                        Awaiting moderator verification.
                      </p>
                    )}
                    {normalizedStatus === "COMPLETED" && (
                      <p className="mt-2 text-xs text-[#2D7A4A]">Approved by moderator.</p>
                    )}
                    {normalizedStatus === "CANCELLED" && (
                      <p className="mt-2 text-xs text-[#A63B3B]">Cancelled by moderator. Please contact moderator for reassignment.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}