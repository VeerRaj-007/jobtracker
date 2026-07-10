"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { Job, Stats, Status } from "@/lib/types";
import KanbanColumn from "@/components/KanbanColumn";
import JobModal from "@/components/JobModal";
import StatsBar from "@/components/StatsBar";

const COLUMNS: Status[] = [
  "WISHLIST",
  "APPLIED",
  "INTERVIEW",
  "OFFERED",
  "REJECTED",
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const fetchJobs = useCallback(async () => {
    if (!token) return;
    try {
      const [jobsData, statsData] = await Promise.all([
        apiRequest("/jobs", {}, token),
        apiRequest("/jobs/stats/summary", {}, token),
      ]);
      return { jobs: jobsData.jobs, stats: statsData.stats };
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      return null;
    }
  }, [token]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    let cancelled = false;

    fetchJobs().then((data) => {
      if (!cancelled && data) {
        setJobs(data.jobs);
        setStats(data.stats);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user, router, fetchJobs]);

  const getJobsByStatus = (status: Status) =>
    jobs.filter((j) => j.status === status);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !token) return;

    const jobId = String(active.id);
    const newStatus = String(over.id) as Status;

    if (!COLUMNS.includes(newStatus)) return;

    const job = jobs.find((j) => j.id === jobId);
    if (!job || job.status === newStatus) return;

    // Optimistic update
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j)),
    );

    try {
      await apiRequest(
        `/jobs/${jobId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        },
        token,
      );
      fetchJobs().then((data) => {
        if (data) {
          setJobs(data.jobs);
          setStats(data.stats);
        }
      });
    } catch (error) {
      // Revert on error
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: job.status } : j)),
      );
    }
  };

  const handleAddJob = async (data: Partial<Job>) => {
    if (!token) return;
    try {
      await apiRequest(
        "/jobs",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        token,
      );
      setShowModal(false);
      fetchJobs().then((data) => {
        if (data) {
          setJobs(data.jobs);
          setStats(data.stats);
        }
      });
    } catch (error) {
      console.error("Failed to add job:", error);
    }
  };

  const handleUpdateJob = async (data: Partial<Job>) => {
    if (!token || !selectedJob) return;
    try {
      await apiRequest(
        `/jobs/${selectedJob.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
        token,
      );
      setSelectedJob(null);
      fetchJobs().then((data) => {
        if (data) {
          setJobs(data.jobs);
          setStats(data.stats);
        }
      });
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!token) return;
    try {
      await apiRequest(`/jobs/${id}`, { method: "DELETE" }, token);
      setSelectedJob(null);
      fetchJobs().then((data) => {
        if (data) {
          setJobs(data.jobs);
          setStats(data.stats);
        }
      });
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0f0f0f]">
        <p className="text-gray-500 text-sm">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      {/* Navbar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-[#2d2d2d]">
        <h1 className="text-white font-bold text-xl">JobTracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{user?.username}</span>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            + Add Application
          </button>
          <button
            onClick={logout}
            className="text-gray-500 hover:text-white text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Stats */}
        {stats && <StatsBar stats={stats} />}

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                jobs={getJobsByStatus(status)}
                onJobClick={(job) => setSelectedJob(job)}
              />
            ))}
          </div>
        </DndContext>
      </div>

      {/* Add Job Modal */}
      {showModal && (
        <JobModal onClose={() => setShowModal(false)} onSave={handleAddJob} />
      )}

      {/* Edit Job Modal */}
      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onSave={handleUpdateJob}
          onDelete={handleDeleteJob}
        />
      )}
    </main>
  );
}
