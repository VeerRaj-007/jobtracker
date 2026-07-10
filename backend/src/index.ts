import "dotenv/config";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import authRouter from "./routes/auth";
import jobsRouter from "./routes/jobs";

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/jobs", jobsRouter);

app.get("/", (req, res) => {
  res.json({ message: "JobTracker API running" });
});

app.use("/auth", authRouter);

const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
