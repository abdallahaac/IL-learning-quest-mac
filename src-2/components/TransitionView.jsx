// src/components/TransitionView.jsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function TransitionView({ screenKey, children }) {
	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={screenKey}
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -8 }}
				transition={{ duration: 0.35, ease: "easeOut" }}
				className="min-h-[60vh]"
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}
