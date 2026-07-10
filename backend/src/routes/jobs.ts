import { Router, Response } from "express";
import prisma from "../prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

// All routes require auth
router.use(authenticate);

// GET all jobs for logged in user
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: "desc" },
    });
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// GET single job
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const job = await prisma.job.findFirst({
      where: { id: String(req.params.id), userId: req.userId! },
    });
    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }
    res.json({ job });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

// POST create job
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const {
      company,
      role,
      status,
      appliedDate,
      deadline,
      notes,
      link,
      salary,
      location,
    } = req.body;

    if (!company || !role) {
      res.status(400).json({ error: "Company and role are required" });
      return;
    }

    const job = await prisma.job.create({
      data: {
        company,
        role,
        status: status || "APPLIED",
        appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
        deadline: deadline ? new Date(deadline) : null,
        notes: notes || null,
        link: link || null,
        salary: salary || null,
        location: location || null,
        userId: req.userId!,
      },
    });

    res.status(201).json({ job });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ error: "Failed to create job" });
  }
});

// PATCH update job (used for drag and drop status change)
router.patch("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.job.findFirst({
      where: { id: String(req.params.id), userId: req.userId! },
    });

    if (!existing) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    const {
      company,
      role,
      status,
      appliedDate,
      deadline,
      notes,
      link,
      salary,
      location,
    } = req.body;

    const job = await prisma.job.update({
      where: { id: String(req.params.id) },
      data: {
        ...(company && { company }),
        ...(role && { role }),
        ...(status && { status }),
        ...(appliedDate && { appliedDate: new Date(appliedDate) }),
        ...(deadline !== undefined && {
          deadline: deadline ? new Date(deadline) : null,
        }),
        ...(notes !== undefined && { notes }),
        ...(link !== undefined && { link }),
        ...(salary !== undefined && { salary }),
        ...(location !== undefined && { location }),
      },
    });

    res.json({ job });
  } catch (error) {
    res.status(500).json({ error: "Failed to update job" });
  }
});

// DELETE job
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.job.findFirst({
      where: { id: String(req.params.id), userId: req.userId! },
    });

    if (!existing) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    await prisma.job.delete({ where: { id: String(req.params.id) } });
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete job" });
  }
});

// GET stats for dashboard
router.get("/stats/summary", async (req: AuthRequest, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { userId: req.userId! },
    });

    const total = jobs.length;
    const applied = jobs.filter((j) => j.status === "APPLIED").length;
    const interviews = jobs.filter((j) => j.status === "INTERVIEW").length;
    const offered = jobs.filter((j) => j.status === "OFFERED").length;
    const rejected = jobs.filter((j) => j.status === "REJECTED").length;
    const wishlist = jobs.filter((j) => j.status === "WISHLIST").length;
    const interviewRate =
      total > 0 ? Math.round((interviews / total) * 100) : 0;
    const offerRate = total > 0 ? Math.round((offered / total) * 100) : 0;

    res.json({
      stats: {
        total,
        applied,
        interviews,
        offered,
        rejected,
        wishlist,
        interviewRate,
        offerRate,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
