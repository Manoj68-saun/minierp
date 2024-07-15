// eslint-disable-next-line
import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot from react-dom/client
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";

const rootElement = document.getElementById("root");

createRoot(rootElement).render(
  // Use createRoot from react-dom/client
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

reportWebVitals();
