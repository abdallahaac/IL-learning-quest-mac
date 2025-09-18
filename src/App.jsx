import React from "react";
import { ScormProvider } from "./contexts/ScormContext.jsx";
import AppShell from "./AppShell.jsx";

/**
 * Root component for the Learning Quest application.  It wraps the
 * AppShell with the SCORM context provider to enable suspend
 * data persistence and LMS integration.  The actual UI and
 * navigation logic live inside AppShell.
 */
export default function App() {
  return (
    <ScormProvider>
      <AppShell />
    </ScormProvider>
  );
}