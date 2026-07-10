"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      login(data.token, data.user);
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0f0f0f]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">JobTracker</h1>
          <p className="text-gray-500 mt-2 text-sm">Sign in to your account</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-[#2d2d2d] text-white placeholder-gray-500 border border-[#3d3d3d] rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full bg-[#2d2d2d] text-white placeholder-gray-500 border border-[#3d3d3d] rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-gray-500 text-sm mt-2">
            Don&apost have an account?{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
