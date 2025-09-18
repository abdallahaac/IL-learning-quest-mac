import { useState, useEffect } from "react";

export default function useHashRoute() {
  const parse = () => {
    const h = window.location.hash.replace(/^#/, "");
    const parts = h.split("/").filter(Boolean);
    if (parts[0] === "page" && parts[1]) {
      const idx = parseInt(parts[1], 10);
      return { pageIndex: isNaN(idx) ? 0 : idx };
    }
    return { pageIndex: 0 };
  };
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onPop = () => setRoute(parse());
    window.addEventListener("popstate", onPop);
    window.addEventListener("hashchange", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("hashchange", onPop);
    };
  }, []);
  const push = (idx) => {
    const nextHash = `#/page/${idx}`;
    if (nextHash !== window.location.hash) {
      history.pushState({}, "", nextHash);
      const evt = new Event("hashchange");
      window.dispatchEvent(evt);
    }
  };
  return [route, push];
}
