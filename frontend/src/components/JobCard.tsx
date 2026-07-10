"use client";

import { Job, STATUS_COLORS } from "@/lib/types";

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
}

export default function JobCard({ job, onClick }: JobCardProps) {
  const color = STATUS_COLORS[job.status];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const isDeadlineSoon = () => {
    if (!job.deadline) return false;
    const deadline = new Date(job.deadline);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000; // 3 days
  };

  return (
    <div
      onClick={() => onClick(job)}
      className="bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg p-4 cursor-pointer hover:border-[#555] transition group"
    >
      {/* Company + Role */}
      <div className="mb-3">
        <h3 className="text-white font-semibold text-sm leading-tight">
          {job.company}
        </h3>
        <p className="text-gray-400 text-xs mt-0.5">{job.role}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {job.location && (
          <span className="text-xs bg-[#3d3d3d] text-gray-400 px-2 py-0.5 rounded-full">
            {job.location}
          </span>
        )}
        {job.salary && (
          <span className="text-xs bg-[#3d3d3d] text-gray-400 px-2 py-0.5 rounded-full">
            {job.salary}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-gray-600 text-xs">
          {formatDate(job.appliedDate)}
        </span>
        {job.deadline && (
          <span
            className={`text-xs ${isDeadlineSoon() ? "text-red-400" : "text-gray-600"}`}
          >
            Due {formatDate(job.deadline)}
          </span>
        )}
      </div>

      {/* Color indicator */}
      <div
        className="h-0.5 rounded-full mt-3"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
