import React from "react";

// helper so calling Pages[type]() returns a React component (via React.lazy)
const lazy = (loader) => React.lazy(loader);

export const Pages = {
	cover: () => lazy(() => import("../pages/CoverPage.jsx")),
	contents: () => lazy(() => import("../pages/ContentsPage.jsx")),
	intro: () => lazy(() => import("../components/IntroPage.jsx")),
	preparation: () => lazy(() => import("../pages/PreparationPage.jsx")),
	resources: () => lazy(() => import("../pages/ResourcesPage.jsx")),
	conclusion: () => lazy(() => import("../pages/ConclusionSection.jsx")),
	activity: () => lazy(() => import("../pages/ActivityPage.jsx")),
	team: () => lazy(() => import("../pages/TeamReflectionPage.jsx")),
	reflection: () => lazy(() => import("../pages/TeamReflectionPage.jsx")),
};
