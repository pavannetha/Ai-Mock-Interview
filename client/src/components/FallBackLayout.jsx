import React from "react";
import { Link } from "react-router-dom";

function FallBackLayout() {
  return (
    <div>
      <h1>Page Not Found</h1>
      <Link to="/">Home</Link>
    </div>
  );
}

export default FallBackLayout;
