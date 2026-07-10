"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Job, Status, STATUS_COLORS, STATUS_LABELS } from "@/lib/types";
import JobCard from "./JobCard";

interface SortableJobCardProps {
  job: Job;
  onClick: (job: Job) => void;
}

function SortableJobCard({ job, onClick }: SortableJobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <JobCard job={job} onClick={onClick} />
    </div>
  );
}

interface KanbanColumnProps {
  status: Status;
  jobs: Job[];
  onJobClick: (job: Job) => void;
}

export default function KanbanColumn({
  status,
  jobs,
  onJobClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const color = STATUS_COLORS[status];

  return (
    <div className="flex flex-col min-w-70 max-w-70">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-white font-semibold text-sm">
            {STATUS_LABELS[status]}
          </span>
        </div>
        <span className="text-gray-500 text-xs bg-[#2d2d2d] px-2 py-0.5 rounded-full">
          {jobs.length}
        </span>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 min-h-50 p-2 rounded-lg transition ${
          isOver ? "bg-[#2d2d2d]" : "bg-[#1a1a1a]"
        }`}
      >
        <SortableContext
          items={jobs.map((j) => j.id)}
          strategy={verticalListSortingStrategy}
        >
          {jobs.map((job) => (
            <SortableJobCard key={job.id} job={job} onClick={onJobClick} />
          ))}
        </SortableContext>

        {jobs.length === 0 && (
          <div className="flex items-center justify-center h-full py-8">
            <p className="text-gray-700 text-xs">No applications</p>
          </div>
        )}
      </div>
    </div>
  );
}
