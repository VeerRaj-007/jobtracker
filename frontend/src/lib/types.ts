export type Status =
  | "WISHLIST"
  | "APPLIED"
  | "INTERVIEW"
  | "OFFERED"
  | "REJECTED";

export interface Job {
  id: string;
  company: string;
  role: string;
  status: Status;
  appliedDate: string;
  deadline?: string | null;
  notes?: string | null;
  link?: string | null;
  salary?: string | null;
  location?: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Stats {
  total: number;
  applied: number;
  interviews: number;
  offered: number;
  rejected: number;
  wishlist: number;
  interviewRate: number;
  offerRate: number;
}

export const STATUS_LABELS: Record<Status, string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFERED: "Offered",
  REJECTED: "Rejected",
};

export const STATUS_COLORS: Record<Status, string> = {
  WISHLIST: "#6366f1",
  APPLIED: "#3b82f6",
  INTERVIEW: "#f59e0b",
  OFFERED: "#10b981",
  REJECTED: "#ef4444",
};
