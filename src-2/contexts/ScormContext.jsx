import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";

const ScormContext = createContext(null);

export const useScorm = () => useContext(ScormContext);

export function ScormProvider({ children }) {
  const [lmsConnected, setLmsConnected] = useState(false);
  const [learnerName, setLearnerName] = useState("Learner");
  const scormInitialized = useRef(false);
  const scorm = useMemo(() => window?.pipwerks?.SCORM ?? null, []);

  useEffect(() => {
    if (scormInitialized.current) return;
    scormInitialized.current = true;
    if (!scorm || !scorm.API?.isFound()) {
      console.warn(
        "SCORM API not available; falling back to localStorage for suspend data"
      );
      return;
    }
    const ok = scorm.init();
    setLmsConnected(ok);
    if (ok) {
      const name = scorm.get("cmi.core.student_name");
      if (name) setLearnerName(name);
      scorm.set("cmi.core.lesson_status", "incomplete");
      scorm.save();
    }
    const handleUnload = () => {
      if (scorm?.isActive) scorm.quit();
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      if (scorm?.isActive) scorm.quit();
    };
  }, [scorm]);

  const setSuspendData = useCallback(
    (obj) => {
      try {
        const raw = JSON.stringify(obj ?? {});
        if (scorm && lmsConnected) {
          scorm.set("cmi.suspend_data", raw);
          scorm.save();
        } else {
          localStorage.setItem("holisticquest:suspend", raw);
        }
        return true;
      } catch (err) {
        console.warn("Error writing suspend data:", err);
        return false;
      }
    },
    [scorm, lmsConnected]
  );

  const getSuspendData = useCallback(() => {
    try {
      if (scorm && lmsConnected) {
        const raw = scorm.get("cmi.suspend_data");
        return raw ? JSON.parse(raw) : {};
      }
      const raw = localStorage.getItem("holisticquest:suspend");
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.warn("Error reading suspend data:", err);
      return {};
    }
  }, [scorm, lmsConnected]);

  return (
    <ScormContext.Provider
      value={{ scorm, lmsConnected, learnerName, getSuspendData, setSuspendData }}
    >
      {children}
    </ScormContext.Provider>
  );
}
