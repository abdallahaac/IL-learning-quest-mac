// src/utils/patternGrid.js
export function getViewportCssSize() {
	const de = document.documentElement;
	const w = Math.max(0, de.clientWidth || window.innerWidth || 0);
	const h = Math.max(0, de.clientHeight || window.innerHeight || 0);
	return { w, h };
}

export function computeCssBackgroundPosition(cellPx) {
	const dpr = Math.max(1, window.devicePixelRatio || 1);
	const { w, h } = getViewportCssSize(); // CSS px
	const W = Math.floor(w * dpr); // device px
	const H = Math.floor(h * dpr);
	const cellDevicePx = Math.max(2, cellPx) * dpr;

	// remainder of the viewport when divided by the cell size
	const remX = W % cellDevicePx;
	const remY = H % cellDevicePx;

	// shift the tile origin so the radial‑gradient dot (tile centre) aligns with the lattice centre
	const offXDevice = (remX - cellDevicePx) / 2;
	const offYDevice = (remY - cellDevicePx) / 2;

	return `${offXDevice / dpr}px ${offYDevice / dpr}px`;
}

export function getCanvasDeviceSize() {
	const dpr = Math.max(1, window.devicePixelRatio || 1);
	const { w, h } = getViewportCssSize();
	return {
		W: Math.floor(w * dpr),
		H: Math.floor(h * dpr),
		dpr,
		cssW: w,
		cssH: h,
	};
}
