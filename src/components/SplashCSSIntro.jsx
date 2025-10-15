// src/components/SplashCSSIntro.jsx
import React, {
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

const SPLASH_LOCK_KEY = "__APP_SPLASH_ACTIVE__";
const CONTAINER_ID = "app-splash-overlay-root";

function getContainer() {
	if (typeof document === "undefined") return null;
	let el = document.getElementById(CONTAINER_ID);
	if (!el) {
		el = document.createElement("div");
		el.id = CONTAINER_ID;
		document.body.appendChild(el);
	}
	return el;
}

const prefersReduced = () =>
	typeof window !== "undefined" &&
	window.matchMedia &&
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function SplashCSSIntro({
	bg = "#4b3a69",
	dotColor = "rgba(255,255,255,0.28)",
	dotSize = 4,
	dotGap = 22,
	logos = [],
	collabText = "Canada School in collaboration with Parks Canada",
	onDone,
	onWillEnd,
	durationMs = 2600,
	fadeOutMs = 700,
	logosStaggerMs = 150,
	leadBgSwitchMs = 100,
}) {
	const reduced = prefersReduced();
	const rootRef = useRef(null);
	const logosRef = useRef(null);
	const captionRef = useRef(null);
	const doneRef = useRef(false);
	const willEndCallRef = useRef(null);
	const [canRender, setCanRender] = useState(false);
	const [container, setContainer] = useState(null);

	useEffect(() => {
		if (typeof document === "undefined" || typeof window === "undefined")
			return;
		if (window[SPLASH_LOCK_KEY]) return;
		window[SPLASH_LOCK_KEY] = true;
		setCanRender(true);
		setContainer(getContainer());
		return () => {
			window[SPLASH_LOCK_KEY] = false;
		};
	}, []);

	const safeDone = () => {
		if (doneRef.current) return;
		doneRef.current = true;
		try {
			window[SPLASH_LOCK_KEY] = false;
		} catch {}
		onDone?.();
	};

	const size = `${dotGap}px ${dotGap}px`;
	const bgImage = useMemo(
		() =>
			`radial-gradient(${dotColor} ${dotSize / 2}px, transparent ${
				dotSize / 2 + 0.01
			}px)`,
		[dotColor, dotSize]
	);

	const Z = 2147483647;

	useLayoutEffect(() => {
		if (!canRender || !rootRef.current) return;

		if (reduced) {
			onWillEnd?.();
			const t = setTimeout(safeDone, 0);
			return () => clearTimeout(t);
		}

		gsap.set(rootRef.current, { opacity: 0, pointerEvents: "auto" });

		const tlIn = gsap.timeline();

		tlIn.to(rootRef.current, {
			opacity: 1,
			duration: 0.35,
			ease: "power2.out",
		});

		tlIn.fromTo(
			logosRef.current?.children || [],
			{ opacity: 0, y: 8, scale: 0.98 },
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.8,
				ease: "power3.out",
				stagger: (logosStaggerMs || 0) / 1000,
			},
			"+=0.05"
		);

		if (captionRef.current) {
			tlIn.fromTo(
				captionRef.current,
				{ opacity: 0, y: 10 },
				{ opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
				"+=0.1"
			);
		}

		const holdSec = Math.max(0, durationMs / 1000);
		const fadeSec = Math.max(0.01, fadeOutMs / 1000);
		const totalSec = holdSec + fadeSec;
		const willEndAt = Math.max(0, totalSec - leadBgSwitchMs / 1000);

		willEndCallRef.current = gsap.delayedCall(willEndAt, () => onWillEnd?.());

		const tlOut = gsap.timeline({
			defaults: { ease: "power2.out" },
			onComplete: safeDone,
		});
		tlOut.to({}, { duration: holdSec });
		tlOut.set(rootRef.current, { pointerEvents: "none" });
		tlOut.to(rootRef.current, { opacity: 0, duration: fadeSec });

		const skip = () => {
			if (doneRef.current) return;
			onWillEnd?.();
			willEndCallRef.current?.kill?.();
			tlOut.kill();
			gsap.set(rootRef.current, { pointerEvents: "none" });
			gsap.to(rootRef.current, {
				opacity: 0,
				duration: Math.max(0.12, fadeSec),
				ease: "power2.out",
				onComplete: safeDone,
			});
		};

		window.addEventListener("click", skip, { once: true });
		window.addEventListener("keydown", skip, { once: true });

		return () => {
			tlIn.kill();
			tlOut.kill();
			willEndCallRef.current?.kill?.();
			window.removeEventListener("click", skip);
			window.removeEventListener("keydown", skip);
		};
	}, [
		canRender,
		reduced,
		durationMs,
		fadeOutMs,
		logosStaggerMs,
		leadBgSwitchMs,
		onWillEnd,
	]);

	if (!canRender || !container) return null;

	return createPortal(
		<div
			ref={rootRef}
			className="fixed inset-0 overflow-hidden"
			style={{
				zIndex: Z,
				background: bg,
				backgroundImage: bgImage,
				backgroundSize: size,
				opacity: 0,
				pointerEvents: "auto",
				isolation: "isolate",
				willChange: "opacity",
			}}
			role="presentation"
			aria-hidden
		>
			<div
				className="absolute inset-0 flex items-center justify-center"
				style={{ pointerEvents: "none" }}
			>
				<div
					ref={logosRef}
					className="inline-flex items-center justify-center gap-6 sm:gap-8 px-4"
				>
					{logos.map((entry, i) => {
						const n =
							typeof entry === "string"
								? { src: entry }
								: entry?.src
								? entry
								: entry?.el
								? entry
								: null;
						if (!n) return null;
						const h =
							typeof n.height === "number"
								? `${n.height}px`
								: n.height || "100px";
						const w = n.width
							? typeof n.width === "number"
								? `${n.width}px`
								: n.width
							: "auto";
						if (n.src) {
							return (
								<img
									key={i}
									src={n.src}
									alt=""
									draggable={false}
									style={{
										height: h,
										width: w,
										filter: "drop-shadow(0 1px 2px rgba(0,0,0,.25))",
									}}
								/>
							);
						}
						const Comp = n.el;
						return (
							<div key={i} style={{ height: h, width: w }}>
								<Comp
									style={{ height: "100%", width: "100%" }}
									preserveAspectRatio="xMidYMid meet"
								/>
							</div>
						);
					})}
				</div>
			</div>

			{collabText ? (
				<div
					ref={captionRef}
					className="absolute left-0 right-0 bottom-[12%] flex items-center justify-center px-4 pointer-events-none"
					style={{ opacity: 0 }}
				>
					<span className="text-white/95 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-center">
						{collabText}
					</span>
				</div>
			) : null}
		</div>,
		container
	);
}
