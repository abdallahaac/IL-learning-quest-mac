function MobileTailSpacer({
	base = 40,
	activityExtra = 80,
	isActivity = false,
}) {
	// Only shows on mobile. Height = footer-h + safe-area + base + optional extra
	const extra = isActivity ? activityExtra : 0;
	return (
		<div
			aria-hidden="true"
			className="block sm:hidden pointer-events-none"
			style={{
				height: `calc(var(--footer-h, 100px) + env(safe-area-inset-bottom, 0px) + ${
					base + extra
				}px)`,
			}}
		/>
	);
}
