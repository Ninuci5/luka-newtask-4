"use client";

import { useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const fields = [
  { name: "firstName", label: "სახელი" },
  { name: "lastName", label: "გვარი" },
  { name: "age", label: "ასაკი", type: "number" },
  { name: "email", label: "იმეილი", type: "email" },
  { name: "password", label: "პაროლი", type: "password" },
  { name: "phone", label: "ტელეფონი", type: "tel" },
];

const initialValues = {
  firstName: "",
  lastName: "",
  age: "",
  email: "",
  password: "",
  phone: "",
};

function validatePhone(raw) {
  const value = raw.trim();
  if (!value) return "ტელეფონი სავალდებულოა";
  if (!/^\d+$/.test(value)) return "ტელეფონი უნდა შეიცავდეს მხოლოდ ციფრებს";
  if (value.length < 10) return "ტელეფონი უნდა შედგებოდეს მინიმუმ 10 სიმბოლოსგან";
  if (value.length > 100) return "ტელეფონი უნდა შედგებოდეს მაქსიმუმ 100 სიმბოლოსგან";
  return "";
}

function validatePassword(value) {
  if (!value) return "პაროლი სავალდებულოა";
  if (value.length < 6) return "პაროლი უნდა შედგებოდეს მინიმუმ 6 სიმბოლოსგან";
  if (value.length > 12) return "პაროლი უნდა შედგებოდეს მაქსიმუმ 12 სიმბოლოსგან";
  if (!/[A-Z]/.test(value)) return "პაროლი უნდა შეიცავდეს მინიმუმ 1 დიდ ასოს";
  if (!/[a-z]/.test(value)) return "პაროლი უნდა შეიცავდეს მინიმუმ 1 პატარა ასოს";
  if (!/[0-9]/.test(value)) return "პაროლი უნდა შეიცავდეს მინიმუმ 1 რიცხვს";
  return "";
}

function validateEmail(raw) {
  const value = raw.trim();
  if (!value) return "იმეილი სავალდებულოა";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "იმეილის ფორმატი არასწორია";
  return "";
}

function validateByType(field, raw) {
  if (field.type === "number") return validateAge(raw);
  if (field.type === "email") return validateEmail(raw);
  if (field.type === "password") return validatePassword(raw);
  if (field.type === "tel") return validatePhone(raw);
  return validateField(field.label, raw);
}

function validateAge(raw) {
  const value = raw.trim();
  if (!value) return "ასაკი სავალდებულოა";
  const num = Number(value);
  if (!Number.isInteger(num)) return "ასაკი უნდა იყოს მთელი რიცხვი";
  if (num < 13) return "ასაკი უნდა იყოს მინიმუმ 13";
  if (num > 120) return "ასაკი უნდა იყოს მაქსიმუმ 120";
  return "";
}

function validateField(label, raw) {
  const value = raw.trim();
  if (!value) return `${label} სავალდებულოა`;
  if (value.length < 4) return `${label} უნდა შედგებოდეს მინიმუმ 4 სიმბოლოსგან`;
  if (value.length > 20) return `${label} უნდა შედგებოდეს მაქსიმუმ 20 სიმბოლოსგან`;
  return "";
}

export default function RegisterForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = {};
    for (const f of fields) {
      const msg = validateByType(f, values[f.name]);
      if (msg) found[f.name] = msg;
    }
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          age: Number(values.age),
          email: values.email.trim(),
          password: values.password,
          phone: values.phone.trim(),
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setStatus({
        type: "success",
        message: `რეგისტრაცია წარმატებულია! ID: ${data.id}`,
      });
      setValues(initialValues);
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

      {fields.map((f) => (
        <label key={f.name} className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
          {f.label}
          <input
            name={f.name}
            type={f.type ?? "text"}
            value={values[f.name]}
            onChange={handleChange}
            className="rounded border border-zinc-300 bg-transparent px-3 py-2 text-base text-black dark:border-zinc-700 dark:text-white"
          />
          {errors[f.name] && (
            <span className="text-xs text-red-600">{errors[f.name]}</span>
          )}
        </label>
      ))}

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
