import React from "react";

export default function PopupModel({ enableEdit, RenderComponent }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => enableEdit(false)}
      />

      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Edit Profile</h3>
          <button
            onClick={() => enableEdit(false)}
            className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            Close
          </button>
        </div>

        <div className="p-4">
          <RenderComponent enableEdit={enableEdit} />
        </div>
      </div>
    </div>
  );
}
