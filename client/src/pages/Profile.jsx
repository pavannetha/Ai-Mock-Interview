import React, { useContext, useState } from "react";
import { UserProvider } from "../components/ContextProvider";
import moment from "moment";
import PopupModel from "../components/PopupModel";
import UpdateProfileForm from "../components/UpdateProfileForm";

export default function Profile() {
  const [isEditEnable, setIsEditEnable] = useState(false);
  const { userDetails } = useContext(UserProvider);
  console.log(userDetails, " user Detilas");
  function calucalateAge(dob) {
    if (!dob) return null;
    const age = moment().diff(dob, "years");
    return age;
  }
  function enableEdit() {
    console.log("inside enable Edit");
    setIsEditEnable(!isEditEnable);
  }
  return (
    <div className="h-screen relative">
      {isEditEnable ? (
        <PopupModel
          enableEdit={setIsEditEnable}
          RenderComponent={UpdateProfileForm}
        />
      ) : null}
      <div className="h-60 border-1 mt-10">
        <div className="flex justify-end">
          <div
            className="mr-3 mt-3 cursor-pointer p-1 rounded border-1"
            onClick={enableEdit}
          >
            Edit
          </div>
        </div>
        <div>
          <p>Name : {userDetails.name}</p>
        </div>
        <div>
          <p>Email : {userDetails.email}</p>
        </div>
        <div>
          <p>
            Age : {userDetails.dob ? calucalateAge(userDetails.dob) : "N/A"}
          </p>
        </div>
        <div>
          <p>Phone No. :{userDetails.phone}</p>
        </div>
      </div>
    </div>
  );
}
