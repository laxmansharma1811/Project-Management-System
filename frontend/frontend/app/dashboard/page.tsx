"use client";

import { logout } from "../lib/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <button
        onClick={handleLogout}
        className="mt-5 bg-red-500 text-white px-4 py-2"
      >
        Logout
      </button>
    </div>
  );
}