import React from "react";
import { LazyMotion, domAnimation } from "framer-motion";

export const MotionProvider = ({ children }) => (
	<LazyMotion features={domAnimation}>{children}</LazyMotion>
);
