import React from "react";
import { Link } from "react-router-dom";

function FallBackLayout() {
  return (
    <div className="h-[80vh] flex flex-col gap-5 justify-center items-center">
      <h1 className="text-center text-6xl font-mono">
        <div>4&#128530;4</div>
        <div>Page Not Found</div>
      </h1>
      <div>
        <Link className="border p-2 shadow hover:shadow-lg rounded" to="/">
          Home
        </Link>
      </div>
    </div>
  );
}

export default FallBackLayout;
