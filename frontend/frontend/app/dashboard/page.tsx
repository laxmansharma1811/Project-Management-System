"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import { logout } from "../lib/auth";
import { Workspace } from "../types/workspace";
import { Project } from "../types/project";
import { Task } from "../types/task";

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);

  // ===========================
  // WORKSPACES STATE
  // ===========================
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [workspacesLoading, setWorkspacesLoading] = useState(false);
  const [workspacesError, setWorkspacesError] = useState<string | null>(null);
  const [creatingWorkspace, setCreatingWorkspace] = useState(false);

  // ===========================
  // PROJECTS STATE
  // ===========================
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<number | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [creatingProject, setCreatingProject] = useState(false);
  
  // High-fidelity UI state to replace primitive window.prompt()
  const [inlineProjectName, setInlineProjectName] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);

  // ===========================
  // TASKS STATE
  // ===========================
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [creatingTask, setCreatingTask] = useState(false);
  const [togglingTask, setTogglingTask] = useState<number | null>(null);
  const [deletingTask, setDeletingTask] = useState<number | null>(null);

  // ===========================
  // AUTH CHECK & INIT
  // ===========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setIsMounted(true);
    fetchWorkspaces();
  }, []);

  // ===========================
  // WORKSPACES FUNCTIONS
  // ===========================
  async function fetchWorkspaces() {
    setWorkspacesLoading(true);
    setWorkspacesError(null);
    try {
      const res = await api.get("/workspaces");
      setWorkspaces(res.data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch workspaces";
      setWorkspacesError(errorMsg);
      console.error("Fetch workspaces error:", err);
    } finally {
      setWorkspacesLoading(false);
    }
  }

  async function createWorkspace() {
    if (!workspaceName.trim()) {
      setWorkspacesError("Workspace name is required");
      return;
    }

    setCreatingWorkspace(true);
    setWorkspacesError(null);
    try {
      await api.post("/workspaces", {
        name: workspaceName,
        description: workspaceDescription,
      });

      setWorkspaceName("");
      setWorkspaceDescription("");
      await fetchWorkspaces();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create workspace";
      setWorkspacesError(errorMsg);
      console.error("Create workspace error:", err);
    } finally {
      setCreatingWorkspace(false);
    }
  }

  // ===========================
  // PROJECTS FUNCTIONS
  // ===========================
  async function fetchProjects(workspaceId: number) {
    setProjectsLoading(true);
    setProjectsError(null);
    setTasksError(null);
    setShowProjectForm(false);
    setInlineProjectName("");

    try {
      const res = await api.get(`/projects/${workspaceId}`);
      setProjects(res.data || []);
      setSelectedWorkspace(workspaceId);
      setTasks([]);
      setSelectedProject(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch projects";
      setProjectsError(errorMsg);
      console.error("Fetch projects error:", err);
      setProjects([]);
      setTasks([]);
      setSelectedProject(null);
    } finally {
      setProjectsLoading(false);
    }
  }

  // Seamless drop-in project generator replacing legacy prompt box
  async function createProject() {
    if (!selectedWorkspace) {
      setProjectsError("Select a workspace first");
      return;
    }
    if (!inlineProjectName.trim()) {
      setProjectsError("Project title mapping target cannot be empty");
      return;
    }

    setCreatingProject(true);
    setProjectsError(null);
    try {
      await api.post("/projects", {
        name: inlineProjectName,
        workspace_id: selectedWorkspace,
      });

      setInlineProjectName("");
      setShowProjectForm(false);
      await fetchProjects(selectedWorkspace);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create project";
      setProjectsError(errorMsg);
      console.error("Create project error:", err);
    } finally {
      setCreatingProject(false);
    }
  }

  // ===========================
  // TASKS FUNCTIONS
  // ===========================
  async function fetchTasks(projectId: number) {
    setTasksLoading(true);
    setTasksError(null);

    try {
      const res = await api.get(`/tasks/project/${projectId}`);
      setTasks(res.data || []);
      setSelectedProject(projectId);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch tasks";
      setTasksError(errorMsg);
      console.error("Fetch tasks error:", err);
      setTasks([]);
      setSelectedProject(null);
    } finally {
      setTasksLoading(false);
    }
  }

  async function createTask() {
    if (!selectedProject) {
      setTasksError("Select a project first");
      return;
    }
    if (!taskTitle.trim()) {
      setTasksError("Task title is required");
      return;
    }

    setCreatingTask(true);
    setTasksError(null);
    try {
      await api.post("/tasks", {
        title: taskTitle,
        description: taskDescription,
        project_id: selectedProject,
      });

      setTaskTitle("");
      setTaskDescription("");
      await fetchTasks(selectedProject);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create task";
      setTasksError(errorMsg);
      console.error("Create task error:", err);
    } finally {
      setCreatingTask(false);
    }
  }

  async function deleteTask(taskId: number) {
    setTasksError("Delete structural configuration feature is currently read-only on the production server cluster.");
  }

  async function toggleTaskStatus(task: Task) {
    setTasksError("Task state updates are currently globally restricted on this network cluster resource.");
  }

  if (!isMounted) return null;

  const activeWorkspaceObj = workspaces.find(w => w.id === selectedWorkspace);
  const activeProjectObj = projects.find(p => p.id === selectedProject);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* ENTERPRISE PLATFORM NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            {/* BRAND LOGO CONSOLE MATRIX */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md shadow-slate-900/10">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-slate-950 text-base">TaskFlow</span>
                <span className="rounded-full bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-600">
                  Enterprise
                </span>
              </div>
            </div>

            {/* IDENTITY ACTIONS PANEL */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900">Active Node</span>
                <span className="text-[10px] font-mono font-medium text-slate-400">STATUS: REPLICATED</span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 shadow-sm hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* CORE 3-COLUMN FLEXIBLE WORKSPACE GRID */}
      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          
          {/* ==================== COLUMN 1: WORKSPACES (3/12 width) ==================== */}
          <section className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Workspaces</h2>
              <p className="text-xs text-slate-500 mt-0.5">Isolate team scopes</p>
            </div>

            {/* Create Workspace Form */}
            <div className="bg-slate-50/60 rounded-xl p-3 border border-slate-200/60 space-y-2.5">
              <input
                type="text"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                placeholder="Workspace name..."
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                disabled={creatingWorkspace}
              />
              <textarea
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all resize-none"
                placeholder="Scope objective metrics..."
                value={workspaceDescription}
                onChange={(e) => setWorkspaceDescription(e.target.value)}
                disabled={creatingWorkspace}
                rows={2}
              />
              <button
                onClick={createWorkspace}
                disabled={creatingWorkspace || workspacesLoading || !workspaceName.trim()}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-40 transition-all cursor-pointer"
              >
                {creatingWorkspace ? "Provisioning..." : "Add Workspace"}
              </button>
            </div>

            {/* Error Display */}
            {workspacesError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-xl text-[11px] font-medium flex items-start gap-2">
                <span className="text-rose-500 font-bold">!</span>
                <span>{workspacesError}</span>
              </div>
            )}

            {/* Workspaces List Viewport */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {workspacesLoading && workspaces.length === 0 ? (
                <div className="space-y-2 animate-pulse">
                  {[1, 2, 3].map((n) => <div key={n} className="h-16 bg-slate-100 rounded-xl" />)}
                </div>
              ) : workspaces.length === 0 ? (
                <div className="text-slate-400 text-center py-6 text-xs border border-dashed border-slate-200 rounded-xl">
                  No provisioned workspaces.
                </div>
              ) : (
                workspaces.map((ws) => {
                  const isActive = selectedWorkspace === ws.id;
                  return (
                    <div
                      key={ws.id}
                      onClick={() => fetchProjects(ws.id)}
                      className={`group flex flex-col items-start border p-3.5 rounded-xl transition-all shadow-sm cursor-pointer ${
                        isActive
                          ? "bg-indigo-50/50 border-indigo-600 ring-1 ring-indigo-600/10"
                          : "bg-white border-slate-200/80 hover:bg-slate-50/80 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <h3 className={`font-bold text-xs tracking-tight transition-colors ${isActive ? "text-indigo-600" : "text-slate-900"}`}>
                          {ws.name}
                        </h3>
                        <span className="text-[9px] font-mono font-bold tracking-tight text-slate-400">
                          ID: {ws.id}
                        </span>
                      </div>
                      {ws.description && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {ws.description}
                        </p>
                      )}
                      <div className="w-full flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 group-hover:border-slate-200/60 transition-colors">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                          Explore Node
                        </span>
                        <svg className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* ==================== COLUMN 2: PROJECTS (4/12 width) ==================== */}
          <section className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Projects</h2>
                <p className="text-xs text-slate-500 mt-0.5">Active architecture boards</p>
              </div>
              
              {selectedWorkspace !== null && !showProjectForm && (
                <button
                  onClick={() => setShowProjectForm(true)}
                  className="rounded-lg bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-[11px] font-bold text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  + Add Project
                </button>
              )}
            </div>

            {selectedWorkspace === null ? (
              <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/40 p-4">
                <div className="rounded-full bg-slate-100 p-2.5 text-slate-400 mb-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold text-slate-700">Awaiting Core Context</h4>
                <p className="text-[11px] text-slate-400 max-w-xs mt-0.5 leading-relaxed">
                  Select a cluster workspace from the list to synchronize project nodes.
                </p>
              </div>
            ) : (
              <>
                {/* Embedded Project Field Panel (Replaces old Prompt Window completely) */}
                {showProjectForm && (
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-indigo-100 space-y-2 animate-in slide-in-from-top-1 duration-150">
                    <label className="block text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                      New Project Identifier
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                        placeholder="e.g., Core API Refactor"
                        value={inlineProjectName}
                        onChange={(e) => setInlineProjectName(e.target.value)}
                        disabled={creatingProject}
                      />
                      <button
                        onClick={createProject}
                        disabled={creatingProject || !inlineProjectName.trim()}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-40 transition-all cursor-pointer whitespace-nowrap"
                      >
                        {creatingProject ? "Saving..." : "Save"}
                      </button>
                    </div>
                    <button
                      onClick={() => { setShowProjectForm(false); setInlineProjectName(""); }}
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none p-0 cursor-pointer"
                    >
                      Dismiss Action
                    </button>
                  </div>
                )}

                {/* Error Banner System */}
                {projectsError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-xl text-[11px] font-medium">
                    {projectsError}
                  </div>
                )}

                {/* Loading Grid Mask */}
                {projectsLoading && projects.length === 0 && (
                  <div className="space-y-2 animate-pulse">
                    {[1, 2].map((n) => <div key={n} className="h-14 bg-slate-100 rounded-xl" />)}
                  </div>
                )}

                {/* Empty Operational Arrays */}
                {!projectsLoading && projects.length === 0 && (
                  <div className="text-slate-400 text-center py-8 text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50/20">
                    No active project scopes verified.
                  </div>
                )}

                {/* Dynamic Projects Directory */}
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {projects.map((p) => {
                    const isSelected = selectedProject === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => fetchTasks(p.id)}
                        className={`flex items-center justify-between border p-3.5 rounded-xl transition-all shadow-sm cursor-pointer group ${
                          isSelected
                            ? "bg-slate-900 border-slate-900 text-white shadow-slate-900/10"
                            : "bg-white border-slate-200/80 hover:bg-slate-50/60 hover:border-slate-300 text-slate-900"
                        }`}
                      >
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <h3 className={`font-bold text-xs tracking-tight truncate ${isSelected ? "text-white" : "text-slate-800 group-hover:text-indigo-600"}`}>
                            {p.name}
                          </h3>
                          <p className={`text-[10px] font-mono font-medium ${isSelected ? "text-slate-400" : "text-slate-400"}`}>
                            PROJECT ID: #{p.id}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          {isSelected && (
                            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-sm animate-pulse" />
                          )}
                          <svg className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${isSelected ? "text-white/60" : "text-slate-300 group-hover:text-slate-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </section>

          {/* ==================== COLUMN 3: TASKS (5/12 width) ==================== */}
          <section className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Tasks</h2>
              <p className="text-xs text-slate-500 mt-0.5">Execution work units</p>
            </div>

            {selectedProject === null ? (
              <div className="flex flex-col items-center justify-center text-center py-14 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/40 p-4">
                <div className="rounded-full bg-slate-100 p-2.5 text-slate-400 mb-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold text-slate-700">Awaiting Board Scope</h4>
                <p className="text-[11px] text-slate-400 max-w-xs mt-0.5 leading-relaxed">
                  Select an active deployment project matrix layer to inspect or issue target runtime tasks.
                </p>
              </div>
            ) : (
              <>
                {/* Create Task Form */}
                <div className="bg-slate-50/60 rounded-xl p-3.5 border border-slate-200/60 space-y-2.5">
                  <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Publish Task Payload
                  </span>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                    placeholder="Task header title..."
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    disabled={creatingTask}
                  />
                  <textarea
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all resize-none"
                    placeholder="Detailed structural logs / assignment parameters..."
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    disabled={creatingTask}
                    rows={2}
                  />
                  <button
                    onClick={createTask}
                    disabled={creatingTask || tasksLoading || !taskTitle.trim()}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    {creatingTask ? "Spawning Task Node..." : "Commit Task Token"}
                  </button>
                </div>

                {/* Unified Context Error Display / Read-Only Warning System */}
                {tasksError && (
                  <div className="bg-amber-50 border border-amber-200/80 text-amber-900 p-3.5 rounded-xl text-[11px] font-medium leading-relaxed shadow-sm animate-in fade-in duration-200">
                    <div className="flex gap-2 items-start">
                      <span className="text-amber-600 font-extrabold text-sm shrink-0">⚠</span>
                      <span>{tasksError}</span>
                    </div>
                  </div>
                )}

                {/* Loading Grid Mask */}
                {tasksLoading && tasks.length === 0 && (
                  <div className="space-y-2.5 animate-pulse">
                    {[1, 2, 3].map((n) => <div key={n} className="h-20 bg-slate-100 rounded-xl" />)}
                  </div>
                )}

                {/* Empty State Layout */}
                {!tasksLoading && tasks.length === 0 && (
                  <div className="text-slate-400 text-center py-10 text-xs border border-dashed border-slate-200 rounded-xl">
                    No active tasks scheduled in this engine stack.
                  </div>
                )}

                {/* Tasks List */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {tasks.map((task) => {
                    const isDone = task.status === "done";
                    return (
                      <div
                        key={task.id}
                        className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between gap-3 group"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="space-y-1 flex-1 min-w-0">
                            <h3 className="font-bold text-xs text-slate-900 tracking-tight break-words">
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-[11px] text-slate-500 leading-relaxed break-words">
                                {task.description}
                              </p>
                            )}
                          </div>
                          
                          {/* Controlled read-only pill badge wrapper */}
                          <button
                            onClick={() => toggleTaskStatus(task)}
                            className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md transition-all shadow-sm ${
                              isDone
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                : "bg-amber-50 text-amber-700 border border-amber-200/60"
                            } hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
                          >
                            {task.status}
                          </button>
                        </div>

                        {/* Action Toolbar Base Footer */}
                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                          <span className="text-[9px] font-mono font-medium text-slate-400">
                            TASK ID: #{task.id}
                          </span>
                          
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors bg-transparent border-none p-0 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </section>

        </div>
      </main>

    </div>
  );
}