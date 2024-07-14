import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./Popup.tsx";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <Popup />
    </NextUIProvider>
  </React.StrictMode>
);
