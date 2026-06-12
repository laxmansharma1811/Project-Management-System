"use client";

import { useState } from "react";
import api from "../lib/api";
import { saveToken } from "../lib/auth";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  // State configurations
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom interface alert configurations
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form handling logic
  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    setAlert(null);

    const endpoint = isRegistering ? "/auth/register" : "/auth/login";

    try {
      if (isRegistering) {
        // 1. Process secure registration
        await api.post(endpoint, { email, password });
        
        setAlert({
          type: "success",
          message: "Account provisioned successfully! Authenticating workspace credentials...",
        });

        // 2. Automatically log user in right after a successful registration
        const loginResponse = await api.post("/auth/login", { email, password });
        saveToken(loginResponse.data.access_token);
      } else {
        // Standard Direct Login
        const response = await api.post(endpoint, { email, password });
        saveToken(response.data.access_token);
      }

      // Route directly to your primary dashboard interface
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Auth error:", error);
      
      let errorMessage = "Authentication failed. Please try again.";
      
      if (error.response?.status === 401) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || "Invalid request. Please check your input.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (!error.response) {
        errorMessage = "Cannot connect to server. Is the backend running?";
      } else {
        errorMessage = error.response?.data?.detail || errorMessage;
      }
      
      setAlert({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Toggle utility resetting localized values safely
  function toggleMode() {
    setIsRegistering(!isRegistering);
    setAlert(null);
    setPassword("");
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* LEFT COLUMN: DYNAMIC PREVIEW HOVERBOARD (Hidden on mobile screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800/60">
        
        {/* Subtle background abstract matrix glow shapes */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* TOP PANEL: LOGO BRAND */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="font-extrabold tracking-tight text-white text-lg">TaskFlow</span>
          <span className="rounded-full bg-slate-800 border border-slate-700/80 px-2 py-0.5 text-[10px] font-medium tracking-wide text-slate-400">
            v2.0
          </span>
        </div>

        {/* MID PANEL: IMMERSIVE FLOATING OBJECTIVE BOARD PRESENTATION */}
        <div className="relative my-auto space-y-8 max-w-md">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
              The control center for high-velocity software engineering.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Track tasks, optimize localized database schema synchronization, and coordinate engineering cycles in a single real-time console.
            </p>
          </div>

          {/* SIMULATED GLASSMORPHISM COMPONENT */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sprint Analytics</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Task Completion Efficiency</span>
                <span className="font-mono text-indigo-400 font-bold">94.2%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full w-[94.2%]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold tracking-wider uppercase text-slate-500">Active Queries</div>
                <div className="text-lg font-extrabold text-white mt-0.5">1,402 /s</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold tracking-wider uppercase text-slate-500">API Latency</div>
                <div className="text-lg font-extrabold text-indigo-400 mt-0.5">14ms</div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM PANEL: TECHNICAL DISCLAIMER */}
        <div className="text-xs text-slate-500 font-mono tracking-tight">
          Secure JWT Layer // HS256 Signed Session Token
        </div>
      </div>

      {/* RIGHT COLUMN: REWRITE INTERACTIVE TRANSITION FORM PANEL */}
      <div className="w-full lg:w-1/2 bg-white text-slate-800 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          
          {/* INTERACTIVE MODE TOGGLE SWITCH PILOT PANEL */}
          <div className="flex justify-between items-center">
            {/* Mobile View Minimalist Logo Display */}
            <div className="flex lg:hidden items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="font-bold tracking-tight text-slate-900 text-sm">TaskFlow</span>
            </div>

            <div className="ml-auto flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => isRegistering && toggleMode()}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  !isRegistering ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => !isRegistering && toggleMode()}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isRegistering ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* DYNAMIC FORM TITLE HEADINGS */}
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 transition-all">
              {isRegistering ? "Create your workspace account" : "Sign in to your environment"}
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isRegistering
                ? "Provision clean credentials to begin scheduling engineering tasks."
                : "Enter your secure credentials to sync structural task lists."}
            </p>
          </div>

          {/* LIVE ALERTS AND BANNER INTERPOLATION */}
          {alert && (
            <div className={`flex items-start gap-3 rounded-xl border p-4 text-xs font-medium animate-in fade-in duration-200 ${
              alert.type === "success" 
                ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                : "bg-rose-50 border-rose-100 text-rose-800"
            }`}>
              <svg className={`w-4 h-4 shrink-0 mt-0.5 ${alert.type === "success" ? "text-emerald-500" : "text-rose-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                {alert.type === "success" ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                )}
              </svg>
              <span>{alert.message}</span>
            </div>
          )}

          {/* PRIMARY FORM CONTROL CONTEXT */}
          <form onSubmit={handleAuthSubmit} className="space-y-5">
            
            {/* WORKSPACE EMAIL CHANNEL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
                Workspace Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  disabled={isLoading}
                  placeholder="developer@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-60"
                />
              </div>
            </div>

            {/* SECURITY KEY CHANNEL */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Secure Password
                </label>
                {!isRegistering && (
                  <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all">
                    Forgot Key?
                  </a>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-60"
                />
              </div>

              {/* LIVE PASSWORD COMPLEXITY METER FOR REGISTRATION MODE */}
              {isRegistering && password.length > 0 && (
                <div className="mt-2 text-[11px] font-medium flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-150">
                  <div className="flex gap-1 h-1 w-20 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${password.length >= 8 ? "w-full bg-emerald-500" : "w-1/2 bg-amber-500"}`} />
                  </div>
                  <span className={password.length >= 8 ? "text-emerald-600" : "text-amber-600"}>
                    {password.length >= 8 ? "Strong metric threshold met" : "Requires 8+ characters"}
                  </span>
                </div>
              )}
            </div>

            {/* ACTION DISPATCH TRIGGER */}
            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-slate-800 active:bg-slate-950 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer pt-3"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Node Request...
                </>
              ) : isRegistering ? (
                "Initialize System Account"
              ) : (
                "Establish Workspace Connection"
              )}
            </button>
          </form>

          {/* DYNAMIC INTERACTABLE FOOTER ALTERNATIVE HEADER SWITCH */}
          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            {isRegistering ? "Already have a production token?" : "Need network infrastructure access?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all cursor-pointer bg-transparent border-none p-0"
            >
              {isRegistering ? "Sign In Instead" : "Register Workspace"}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}