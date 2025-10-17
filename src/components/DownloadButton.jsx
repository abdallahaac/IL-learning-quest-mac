// components/DownloadButton.jsx
import React from "react";

export default function DownloadButton({
	onClick,
	disabled = false,
	isDownloading = false,
	accent = "#4380d6",
	label = "Download (.doc)",
	downloadingLabel = "Downloading...",
	className = "",
	ariaLabel,
}) {
	const btnStyle = {
		backgroundColor: disabled ? "#9CA3AF" : accent,
		borderColor: disabled ? "#9CA3AF" : accent,
		color: "#fff",
	};

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-disabled={disabled}
			aria-busy={isDownloading}
			aria-label={ariaLabel || label}
			className={`px-4 py-2 rounded-lg text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center ${className}`}
			style={btnStyle}
		>
			{isDownloading ? (
				<>
					<svg
						className="animate-spin -ml-1 mr-2 h-5 w-5"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						aria-hidden="true"
						role="img"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
						/>
					</svg>
					<span>{downloadingLabel}</span>
				</>
			) : (
				<span>{label}</span>
			)}
		</button>
	);
}
