// src/utils/patternGrid.js
// One source of truth for the lattice size and CSS background alignment.

export function getViewportCssSize() {
	// Layout viewport is what a fixed element with inset-0 actually uses.
	// clientWidth/clientHeight exclude scrollbars and are stable across chrome/UI changes.
	const de = document.documentElement;
	const w = Math.max(0, de.clientWidth || window.innerWidth || 0);
	const h = Math.max(0, de.clientHeight || window.innerHeight || 0);
	return { w, h };
}

export function computeCssBackgroundPosition(cellPx) {
	const dpr = Math.max(1, window.devicePixelRatio || 1);
	const { w, h } = getViewportCssSize(); // CSS px
	const W = Math.floor(w * dpr); // device px used by canvas
	const H = Math.floor(h * dpr); // device px used by canvas
	const cellDevicePx = Math.max(2, cellPx) * dpr;

	const offXDevice = Math.round((W % cellDevicePx) / 2);
	const offYDevice = Math.round((H % cellDevicePx) / 2);

	// Convert back to CSS px for background-position
	const offXCss = offXDevice / dpr;
	const offYCss = offYDevice / dpr;

	return `${offXCss}px ${offYCss}px`;
}

export function getCanvasDeviceSize() {
	const dpr = Math.max(1, window.devicePixelRatio || 1);
	const { w, h } = getViewportCssSize(); // CSS px
	return {
		W: Math.floor(w * dpr),
		H: Math.floor(h * dpr),
		dpr,
		cssW: w,
		cssH: h,
	};
}
