import React, { useContext, useState } from "react";
import { UserProvider } from "./ContextProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { api } from "../apis/interceptors";

export default function UpdateProfileForm() {
  const { userDetails } = useContext(UserProvider);
  const [user, setUser] = useState(userDetails);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const updatedRecords = {};
    for (let key in userDetails) {
      if (userDetails[key] !== user[key]) {
        updatedRecords[key] = user[key];
      }
    }
    console.log(updatedRecords, " updated records");
    try {
      // const update = await axios.patch(
      //   "http://localhost:4000/user/updateProfile",
      //   updatedRecords,
      //   {
      //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      //   },
      // );
      const update = await api.patch("/user/updateProfile", updatedRecords);
      console.log(update);
    } catch (err) {
      toast.error(err.message);
      console.log(err.message);
    }
  }
  return (
    <div>
      <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold">Update Profile</h1>
        <label htmlFor="name">
          Name :
          <input
            className="border-1"
            type="text"
            id="name"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="email">
          Email :
          <input
            className="border-1"
            type="text"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="dob">
          Dob :
          <input
            className="border-1"
            type="date"
            id="dob"
            name="dob"
            value={user.dob}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="phone">
          Phone :
          <input
            className="border-1"
            type="text"
            id="phone"
            name="phone"
            value={user.phone}
            onChange={handleChange}
          />
        </label>
        <input type="submit" />
      </form>
    </div>
  );
}
