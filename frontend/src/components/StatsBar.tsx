"use client";

import { Stats } from "@/lib/types";

interface StatsBarProps {
  stats: Stats;
}

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div className="bg-[#2d2d2d] border border-[#3d3d3d] rounded-xl p-4">
        <p className="text-gray-500 text-xs mb-1">Total Applied</p>
        <p className="text-white text-2xl font-bold">{stats.total}</p>
      </div>
      <div className="bg-[#2d2d2d] border border-[#3d3d3d] rounded-xl p-4">
        <p className="text-gray-500 text-xs mb-1">Interviews</p>
        <p className="text-amber-400 text-2xl font-bold">{stats.interviews}</p>
      </div>
      <div className="bg-[#2d2d2d] border border-[#3d3d3d] rounded-xl p-4">
        <p className="text-gray-500 text-xs mb-1">Interview Rate</p>
        <p className="text-blue-400 text-2xl font-bold">
          {stats.interviewRate}%
        </p>
      </div>
      <div className="bg-[#2d2d2d] border border-[#3d3d3d] rounded-xl p-4">
        <p className="text-gray-500 text-xs mb-1">Offers</p>
        <p className="text-emerald-400 text-2xl font-bold">{stats.offered}</p>
      </div>
    </div>
  );
}
