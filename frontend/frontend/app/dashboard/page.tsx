"use client";

import { useEffect, useState } from "react";

import api from "../lib/api";
import { logout } from "../lib/auth";

import { Workspace } from "../types/workspace";
import { Project } from "../types/project";

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [name, setName] = useState("");

  const [selectedWorkspace, setSelectedWorkspace] =
    useState<number | null>(null);

  // -----------------------
  // CHECK AUTH + LOAD WORKSPACES
  // -----------------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchWorkspaces();
  }, []);

  // -----------------------
  // WORKSPACES
  // -----------------------
  async function fetchWorkspaces() {
    try {
      const res = await api.get("/workspaces");
      setWorkspaces(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function createWorkspace() {
    try {
      await api.post("/workspaces", {
        name,
      });

      setName("");
      fetchWorkspaces();
    } catch (err) {
      console.log(err);
    }
  }

  // -----------------------
  // PROJECTS
  // -----------------------
  async function fetchProjects(workspaceId: number) {
    try {
      const res = await api.get(`/projects/${workspaceId}`);
      setProjects(res.data);
      setSelectedWorkspace(workspaceId);
    } catch (err) {
      console.log(err);
    }
  }

  async function createProject(workspaceId: number) {
    try {
      const projectName = prompt("Project name");

      if (!projectName) return;

      await api.post("/projects", {
        name: projectName,
        workspace_id: workspaceId,
      });

      fetchProjects(workspaceId);
    } catch (err) {
      console.log(err);
    }
  }

  // -----------------------
  // UI
  // -----------------------
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">
          Workspace Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">

        {/* LEFT: WORKSPACES */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            Workspaces
          </h2>

          {/* CREATE WORKSPACE */}
          <div className="bg-white p-4 rounded shadow mb-4">
            <input
              className="border p-2 w-full mb-2"
              placeholder="Workspace name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <button
              onClick={createWorkspace}
              className="bg-black text-white px-4 py-2"
            >
              Create Workspace
            </button>
          </div>

          {/* LIST WORKSPACES */}
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              className="bg-white p-4 rounded shadow mb-3 cursor-pointer hover:bg-gray-50"
            >
              <h3 className="font-bold">
                {ws.name}
              </h3>

              <p className="text-sm text-gray-500">
                ID: {ws.id}
              </p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() =>
                    fetchProjects(ws.id)
                  }
                  className="text-blue-500 text-sm"
                >
                  View Projects
                </button>

                <button
                  onClick={() =>
                    createProject(ws.id)
                  }
                  className="text-green-600 text-sm"
                >
                  + Add Project
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: PROJECTS */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            Projects
          </h2>

          {selectedWorkspace ? (
            <>
              <p className="text-sm text-gray-500 mb-3">
                Workspace ID: {selectedWorkspace}
              </p>

              {projects.length === 0 ? (
                <p className="text-gray-400">
                  No projects found
                </p>
              ) : (
                projects.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white p-4 rounded shadow mb-2"
                  >
                    <h3 className="font-bold">
                      {p.name}
                    </h3>

                    <p className="text-xs text-gray-500">
                      Project ID: {p.id}
                    </p>
                  </div>
                ))
              )}
            </>
          ) : (
            <p className="text-gray-400">
              Select a workspace to view projects
            </p>
          )}
        </div>

      </div>
    </div>
  );
}