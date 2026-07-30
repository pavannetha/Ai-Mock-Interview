import React, { useContext, useState } from "react";
import { UserProvider } from "../components/ContextProvider";
import moment from "moment";
import PopupModel from "../components/PopupModel";
import UpdateProfileForm from "../components/UpdateProfileForm";

export default function Profile() {
  const [isEditEnable, setIsEditEnable] = useState(false);
  const { userDetails } = useContext(UserProvider);

  function calculateAge(dob) {
    if (!dob) return null;
    return moment().diff(dob, "years");
  }

  function initials(name) {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <div className="min-h-screen py-10 px-4">
      {isEditEnable && (
        <PopupModel
          enableEdit={setIsEditEnable}
          RenderComponent={UpdateProfileForm}
        />
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <button
              onClick={() => setIsEditEnable(true)}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="md:flex md:items-start md:gap-8">
              <div className="md:w-1/3 flex flex-col items-center text-center pb-6 md:pb-0">
                <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-700">
                  {initials(userDetails.name)}
                </div>
                <h2 className="mt-4 text-xl font-semibold">
                  {userDetails.name || "Unknown User"}
                </h2>
                <p className="text-sm text-gray-500">{userDetails.email}</p>
                <p className="mt-3 text-sm text-gray-600">
                  Phone: {userDetails.phone || "N/A"}
                </p>
              </div>

              <div className="md:w-2/3 mt-6 md:mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="mt-1 text-sm text-gray-800">
                      {userDetails.dob || "N/A"}
                    </p>
                  </div>

                  <div className="p-4 border rounded">
                    <p className="text-xs text-gray-500">Age</p>
                    <p className="mt-1 text-sm text-gray-800">
                      {userDetails.dob ? calculateAge(userDetails.dob) : "N/A"}
                    </p>
                  </div>

                  <div className="p-4 border rounded">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="mt-1 text-sm text-gray-800">
                      {userDetails.email}
                    </p>
                  </div>

                  <div className="p-4 border rounded">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="mt-1 text-sm text-gray-800">
                      {userDetails.phone || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 border rounded">
                  <p className="text-xs text-gray-500">About</p>
                  <p className="mt-2 text-sm text-gray-700">
                    You can update your profile details by clicking the "Edit
                    Profile" button.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
