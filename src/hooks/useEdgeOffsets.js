// src/hooks/useEdgeOffsets.js
import { useLayoutEffect, useState } from "react";

export default function useEdgeOffsets(extra = 12) {
	const [sizes, setSizes] = useState({ header: 0, footer: 0 });

	useLayoutEffect(() => {
		const headerEl = document.getElementById("app-header");
		const footerEl = document.getElementById("app-footer");

		const read = () => {
			const header = (headerEl?.offsetHeight ?? 0) + extra;
			const footer = (footerEl?.offsetHeight ?? 0) + extra;
			setSizes({ header, footer });
			// expose as CSS vars so pages can use them
			const r = document.documentElement;
			r.style.setProperty("--header-h", `${header}px`);
			r.style.setProperty("--footer-h", `${footer}px`);
		};

		read();

		const ro = new ResizeObserver(read);
		headerEl && ro.observe(headerEl);
		footerEl && ro.observe(footerEl);
		window.addEventListener("resize", read);

		return () => {
			ro.disconnect();
			window.removeEventListener("resize", read);
		};
	}, [extra]);

	return sizes;
}
