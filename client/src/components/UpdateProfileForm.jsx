import React, { useContext, useState } from "react";
import { UserProvider } from "./ContextProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { api } from "../apis/interceptors";

export default function UpdateProfileForm({ enableEdit }) {
  const { userDetails, updateUserDetails } = useContext(UserProvider);
  const [user, setUser] = useState(userDetails || {});

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
      const update = await api.patch("/user/updateProfile", updatedRecords);
      const updatedUser = {
        ...userDetails,
        ...update.data.updatedUser,
      };
      updateUserDetails(updatedUser);
      toast.success("Profile updated successfully");
      if (enableEdit) enableEdit(false);
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
      console.log(err.message);
    }
  }
  return (
    <div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <h1 className="text-xl font-semibold">Update Profile</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex flex-col text-sm">
            <span className="text-gray-600">Name</span>
            <input
              className="mt-1 p-2 border rounded"
              type="text"
              id="name"
              name="name"
              value={user.name || ""}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col text-sm">
            <span className="text-gray-600">Email</span>
            <input
              className="mt-1 p-2 border rounded bg-gray-50"
              type="email"
              id="email"
              name="email"
              value={user.email || ""}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col text-sm">
            <span className="text-gray-600">Date of Birth</span>
            <input
              className="mt-1 p-2 border rounded"
              type="date"
              id="dob"
              name="dob"
              value={user.dob || ""}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col text-sm">
            <span className="text-gray-600">Phone</span>
            <input
              className="mt-1 p-2 border rounded"
              type="text"
              id="phone"
              name="phone"
              value={user.phone || ""}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => enableEdit && enableEdit(false)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
