import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    dob: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  function handleformData(e) {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formValues.password !== formValues.confirmPassword) {
      toast.error("Password and confirm password do not match");
      return;
    }

    if (formValues.phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    const body = {
      name: formValues.name,
      email: formValues.email,
      dob: formValues.dob,
      phone: formValues.phone,
      password: formValues.password,
    };

    try {
      await axios.post("http://localhost:4000/auth/signup", body);
      toast.success("Account created successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-8 grid place-items-center">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-semibold text-slate-800">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign up and start practicing for your next interview.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="flex flex-col gap-1 text-sm font-medium text-slate-700"
            >
              <span>Name</span>
              <input
                className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                type="text"
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleformData}
                required
              />
            </label>
          </div>

          <label
            htmlFor="email"
            className="flex flex-col gap-1 text-sm font-medium text-slate-700"
          >
            <span>Email</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="email"
              id="email"
              name="email"
              value={formValues.email}
              onChange={handleformData}
              required
            />
          </label>

          <label
            htmlFor="dob"
            className="flex flex-col gap-1 text-sm font-medium text-slate-700"
          >
            <span>Date of Birth</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="date"
              id="dob"
              name="dob"
              value={formValues.dob}
              onChange={handleformData}
              required
            />
          </label>

          <label
            htmlFor="phone"
            className="flex flex-col gap-1 text-sm font-medium text-slate-700"
          >
            <span>Phone</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="text"
              id="phone"
              name="phone"
              value={formValues.phone}
              onChange={handleformData}
              maxLength={10}
              required
            />
          </label>

          <label
            htmlFor="password"
            className="flex flex-col gap-1 text-sm font-medium text-slate-700"
          >
            <span>Password</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="password"
              id="password"
              name="password"
              value={formValues.password}
              onChange={handleformData}
              required
            />
          </label>

          <label
            htmlFor="confirmPassword"
            className="flex flex-col gap-1 text-sm font-medium text-slate-700"
          >
            <span>Confirm Password</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleformData}
              required
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          <span>Already have an account?</span>{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
