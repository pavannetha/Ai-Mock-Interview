import axios from "axios";
import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

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
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

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
      toast.error("incorrect phone number format");
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
      const data = await axios.post("http://localhost:4000/auth/signup", body);
      console.log(data);
      navigate("/login");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  }
  return (
    <div className="h-screen flex flex-col justify-center items-center">
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
        <label htmlFor="dob">
          Dob :
          <input
            className="border-1"
            type="date"
            id="dob"
            name="dob"
            value={formValues.dob}
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
      <Link to="/login">Login</Link>
    </div>
  );
}
