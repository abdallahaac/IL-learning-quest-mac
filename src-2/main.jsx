import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Entry point for the holistic quest application.  This file
// bootstraps the React tree and applies the global CSS.  Thee
// application uses a custom SCORM provider and a hash‑based
// router to navigate between pages.
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
