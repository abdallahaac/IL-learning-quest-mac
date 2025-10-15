(function () {
	if (!window.pipwerks || !pipwerks.SCORM || !pipwerks.SCORM.API) return;

	var _cachedAPI = null;

	function fastFindAPI() {
		if (_cachedAPI) return _cachedAPI;

		// Quick checks
		var w = window;
		if (w.API || w.API_1484_11) return (_cachedAPI = w.API || w.API_1484_11);
		if (w.parent && (w.parent.API || w.parent.API_1484_11))
			return (_cachedAPI = w.parent.API || w.parent.API_1484_11);
		if (w.top && (w.top.API || w.top.API_1484_11))
			return (_cachedAPI = w.top.API || w.top.API_1484_11);

		// Capped walk up (Brightspace nests deeply; 10 is plenty)
		var depth = 0,
			limit = 10;
		try {
			w = window.parent;
			while (w && depth < limit) {
				if (w.API || w.API_1484_11) {
					_cachedAPI = w.API || w.API_1484_11;
					break;
				}
				if (w === w.parent) break;
				w = w.parent;
				depth++;
			}
		} catch (e) {
			/* ignore cross-frame */
		}

		return _cachedAPI;
	}

	// Override pipwerks getters to be fast & memoized
	pipwerks.SCORM.API.get = function () {
		return fastFindAPI();
	};
	pipwerks.SCORM.API.isFound = function () {
		var API = fastFindAPI();
		if (API) pipwerks.SCORM.version = API.LMSGetValue ? "1.2" : "2004";
		return !!API;
	};

	// Quiet logs in production
	pipwerks.debug = { isActive: false };
})();
