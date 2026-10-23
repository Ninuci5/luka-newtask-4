"use client";

import { useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function validate(firstName) {
  const value = firstName.trim();
  if (!value) return "სახელი სავალდებულოა";
  if (value.length < 4) return "სახელი უნდა შედგებოდეს მინიმუმ 4 სიმბოლოსგან";
  if (value.length > 20) return "სახელი უნდა შედგებოდეს მაქსიმუმ 20 სიმბოლოსგან";
  return "";
}

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFirstName(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(firstName);
    setError(found);
    if (found) return;

    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: firstName.trim() }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setStatus({
        type: "success",
        message: `რეგისტრაცია წარმატებულია! ID: ${data.id}`,
      });
      setFirstName("");
    } catch {
      setStatus({ type: "error", message: "რეგისტრაცია ვერ მოხერხდა, სცადეთ თავიდან." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-8 shadow dark:bg-zinc-900"
    >
      <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
        რეგისტრაცია
      </h2>

      <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
        სახელი
        <input
          name="firstName"
          type="text"
          value={firstName}
          onChange={handleChange}
          className="rounded border border-zinc-300 bg-transparent px-3 py-2 text-base text-black dark:border-zinc-700 dark:text-white"
        />
        {error && <span className="text-xs text-red-600">{error}</span>}
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white transition-opacity disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {loading ? "იგზავნება..." : "რეგისტრაცია"}
      </button>

      {status.message && (
        <p className={status.type === "success" ? "text-green-600" : "text-red-600"}>
          {status.message}
        </p>
      )}
    </form>
  );
}
