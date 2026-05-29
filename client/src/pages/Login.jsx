import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
  }
  async function login(e) {
    e.preventDefault();
    try {
      const data = await axios.post(
        "http://localhost:4000/auth/login",
        loginFormData,
      );
      console.log(data, " data in login page");
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.userDetails));
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <div>
      <form onSubmit={login}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            className="border-1"
            type="email"
            onChange={handleChange}
            value={loginFormData.email}
            name="email"
            id="email"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            className="border-1"
            type="password"
            onChange={handleChange}
            value={loginFormData.password}
            name="password"
            id="password"
            required
          />
        </div>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
