import React from "react";

export default function PopupModel({ enableEdit, RenderComponent }) {
  return (
    <div className="h-[500px] p-2 left-[25%] shadow-2xl w-[500px] bg-white absolute">
      <div className="flex justify-end">
        <button onClick={() => enableEdit(false)}>Close</button>
      </div>
      <RenderComponent />
    </div>
  );
}
