import React from "react";
import ReactDOM from "react-dom/client";
import RangTarang from "./RangTarang.jsx";
import { Analytics } from "@vercel/analytics/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <>
      <RangTarang />
      <Analytics />
    </>
  </React.StrictMode>
);
