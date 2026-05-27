import axios from "axios";
import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Signup() {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    age: 0,
    phone: "",
    password: "",
    confirmPassword: "",
  });

  function handleformData(e) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }
  console.log(formValues);

  async function handleSubmit(e) {
    e.preventDefault();
    if (formValues.password !== formValues.confirmPassword) {
      toast.error("password and cofirm password not matching", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (formValues.phone.length > 10) {
      toast.error("incorrect phone number format", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    const data = await axios.post("http://localhost:4000/auth/signup");
    console.log(data);
  }
  return (
    <div className="h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center flex-col gap-1"
      >
        <label htmlFor="name">
          Name :
          <input
            className="border-1"
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleformData}
          />
        </label>
        <label htmlFor="email">
          Email :
          <input
            className="border-1"
            type="text"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleformData}
          />
        </label>
        <label htmlFor="age">
          Age :
          <input
            className="border-1"
            type="number"
            id="age"
            name="age"
            value={formValues.age}
            onChange={handleformData}
          />
        </label>
        <label htmlFor="phone">
          Phone :
          <input
            className="border-1"
            type="text"
            id="phone"
            name="phone"
            value={formValues.phone}
            onChange={handleformData}
          />
        </label>
        <label htmlFor="password">
          Password :
          <input
            className="border-1"
            type="password"
            id="password"
            name="password"
            value={formValues.password}
            onChange={handleformData}
          />
        </label>
        <label htmlFor="confirmPassword">
          Confirm Password :
          <input
            className="border-1"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formValues.confirmPassword}
            onChange={handleformData}
          />
        </label>
        <input type="submit" />
      </form>
    </div>
  );
}
