// InukIcons.jsx
import React from "react";
import { motion } from "framer-motion";
import inuk from "../../assets/inuk.svg";
import inukGrey from "../../assets/inuk-grey.svg";

export function InukIcon({ className = "w-4 h-4", title = "Inuk symbol" }) {
	return (
		<span
			role="img"
			aria-label={title}
			className={className}
			style={{
				display: "inline-block",
				backgroundColor: "currentColor",
				WebkitMask: `url(${inuk}) center / contain no-repeat`,
				mask: `url(${inuk}) center / contain no-repeat`,
			}}
		/>
	);
}

export function InukSwapIcon({
	active,
	className = "w-4 h-4",
	title = "Inuk symbol",
}) {
	return (
		<span
			className={className}
			role="img"
			aria-label={title}
			style={{ display: "inline-block" }}
		>
			<motion.img
				key={active ? "inuk-color" : "inuk-grey"}
				src={active ? inuk : inukGrey}
				alt=""
				className="w-full h-full"
			/>
		</span>
	);
}
