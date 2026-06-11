"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    try {
      await api.post("/auth/register", {
        email,
        password,
      });

      alert("Registered Successfully");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-5">
        Register
      </h1>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        className="border p-2 w-full mb-3"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button
        onClick={handleRegister}
        className="bg-black text-white px-4 py-2"
      >
        Register
      </button>
    </div>
  );
}