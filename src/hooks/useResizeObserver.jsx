// src/hooks/useResizeObserver.js
import { useEffect, useRef, useState } from "react";

export default function useResizeObserver() {
	const ref = useRef(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		if (!ref.current) return;
		const el = ref.current;
		const obs = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const box = entry.borderBoxSize?.[0] || entry.contentRect;
				const height = ("blockSize" in box ? box.blockSize : box.height) || 0;
				const width = ("inlineSize" in box ? box.inlineSize : box.width) || 0;
				setSize({ width, height });
			}
		});
		obs.observe(el);
		return () => obs.disconnect();
	}, []);

	return [ref, size];
}
