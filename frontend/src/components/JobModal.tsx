"use client";

import { useState } from "react";
import { Job, Status, STATUS_LABELS } from "@/lib/types";

interface JobModalProps {
  job?: Job | null;
  onClose: () => void;
  onSave: (data: Partial<Job>) => void;
  onDelete?: (id: string) => void;
}

export default function JobModal({
  job,
  onClose,
  onSave,
  onDelete,
}: JobModalProps) {
  const [form, setForm] = useState({
    company: job?.company || "",
    role: job?.role || "",
    status: (job?.status || "APPLIED") as Status,
    location: job?.location || "",
    salary: job?.salary || "",
    link: job?.link || "",
    notes: job?.notes || "",
    deadline: job?.deadline
      ? new Date(job.deadline).toISOString().split("T")[0]
      : "",
    appliedDate: job?.appliedDate
      ? new Date(job.appliedDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  });

  const handleSave = () => {
    if (!form.company || !form.role) return;
    onSave({
      ...form,
      deadline: form.deadline || null,
      location: form.location || null,
      salary: form.salary || null,
      link: form.link || null,
      notes: form.notes || null,
    } as Partial<Job>);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e1e1e] border border-[#3d3d3d] rounded-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3d3d3d]">
          <h2 className="text-white font-semibold">
            {job ? "Edit Application" : "Add Application"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-4 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-gray-400 text-xs mb-1 block">
                Company *
              </label>
              <input
                type="text"
                placeholder="Google"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full bg-[#2d2d2d] text-white placeholder-gray-600 border border-[#3d3d3d] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition"
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-400 text-xs mb-1 block">Role *</label>
              <input
                type="text"
                placeholder="SWE Intern"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full bg-[#2d2d2d] text-white placeholder-gray-600 border border-[#3d3d3d] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as Status })
              }
              className="w-full bg-[#2d2d2d] text-white border border-[#3d3d3d] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition"
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-gray-400 text-xs mb-1 block">
                Location
              </label>
              <input
                type="text"
                placeholder="Remote"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full bg-[#2d2d2d] text-white placeholder-gray-600 border border-[#3d3d3d] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition"
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-400 text-xs mb-1 block">Salary</label>
              <input
                type="text"
                placeholder="$20/hr"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                className="w-full bg-[#2d2d2d] text-white placeholder-gray-600 border border-[#3d3d3d] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Job Link</label>
            <input
              type="url"
              placeholder="https://..."
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full bg-[#2d2d2d] text-white placeholder-gray-600 border border-[#3d3d3d] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-gray-400 text-xs mb-1 block">
                Applied Date
              </label>
              <input
                type="date"
                value={form.appliedDate}
                onChange={(e) =>
                  setForm({ ...form, appliedDate: e.target.value })
                }
                className="w-full bg-[#2d2d2d] text-white border border-[#3d3d3d] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition"
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-400 text-xs mb-1 block">
                Deadline
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full bg-[#2d2d2d] text-white border border-[#3d3d3d] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Notes</label>
            <textarea
              placeholder="Any notes about this application..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full bg-[#2d2d2d] text-white placeholder-gray-600 border border-[#3d3d3d] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#3d3d3d]">
          <div>
            {job && onDelete && (
              <button
                onClick={() => onDelete(job.id)}
                className="text-red-400 hover:text-red-300 text-sm transition"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-sm transition px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              {job ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
