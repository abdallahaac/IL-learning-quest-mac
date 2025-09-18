/**
 * SCORM API Wrapper v1.1.2 by Philip Hutchison, May 2008
 * https://github.com/pipwerks/scorm-api-wrapper
 *
 * Copyright (c) 2008-2020 Philip Hutchison
 * MIT-style license
 *
 * This wrapper is designed to work with SCORM 1.2, SCORM 2004 3rd Edition,
 * and AICC HACP.
 */

var pipwerks = {}; // pipwerks 'namespace' helps prevent naming conflicts.
pipwerks.UTILS = {}; // For holding utility functions
pipwerks.debug = {
	isActive: true,
}; // Enable (true) or disable (false) for console logging
pipwerks.SCORM = {
	// Private SCORM properties
	version: null, // Store SCORM version.
	handle: null, // Handle to the SCORM API
	isActive: false, // Ensure the API is active or initialized.
};

// ------------------------------------------------------------------------- //
// --- SCORM.API functions ------------------------------------------------- //
// ------------------------------------------------------------------------- //

pipwerks.SCORM.API = {
	get: function () {
		var API = null,
			win = window;

		if (win.API) {
			// SCORM 1.2
			API = win.API;
		} else if (win.API_1484_11) {
			// SCORM 2004
			API = win.API_1484_11;
		}

		if (API) {
			return API;
		} else {
			// Can't find the API in current window.
			var n = 0,
				limit = 500;
			while (n < limit && !API) {
				try {
					win = win.parent;
					if (win.API) {
						// SCORM 1.2
						API = win.API;
					} else if (win.API_1484_11) {
						// SCORM 2004
						API = win.API_1484_11;
					}
				} catch (e) {
					// empty
				}
				n++;
			}
			return API;
		}
	},

	isFound: function () {
		var API = this.get(),
			scorm = pipwerks.SCORM;
		if (API) {
			scorm.version = API.LMSGetValue ? "1.2" : "2004";
		}
		return API ? true : false;
	},
};

// ------------------------------------------------------------------------- //
// --- SCORM functions ----------------------------------------------------- //
// ------------------------------------------------------------------------- //

pipwerks.SCORM.init = function () {
	var scorm = pipwerks.SCORM,
		API = scorm.API.get(),
		result = false;

	if (API) {
		switch (scorm.version) {
			case "1.2":
				result = API.LMSInitialize("") === "true";
				break;
			case "2004":
				result = API.Initialize("") === "true";
				break;
		}
	}
	scorm.isActive = result;
	return result;
};

pipwerks.SCORM.get = function (param) {
	var scorm = pipwerks.SCORM,
		API = scorm.API.get(),
		result = null;

	if (scorm.isActive && API) {
		switch (scorm.version) {
			case "1.2":
				result = API.LMSGetValue(param);
				break;
			case "2004":
				result = API.GetValue(param);
				break;
		}
	}
	return result;
};

pipwerks.SCORM.set = function (param, value) {
	var scorm = pipwerks.SCORM,
		API = scorm.API.get(),
		result = false;

	if (scorm.isActive && API) {
		switch (scorm.version) {
			case "1.2":
				result = API.LMSSetValue(param, value) === "true";
				break;
			case "2004":
				result = API.SetValue(param, value) === "true";
				break;
		}
	}
	return result;
};

pipwerks.SCORM.save = function () {
	var scorm = pipwerks.SCORM,
		API = scorm.API.get(),
		result = false;

	if (scorm.isActive && API) {
		switch (scorm.version) {
			case "1.2":
				result = API.LMSCommit("") === "true";
				break;
			case "2004":
				result = API.Commit("") === "true";
				break;
		}
	}
	return result;
};

pipwerks.SCORM.quit = function () {
	var scorm = pipwerks.SCORM,
		API = scorm.API.get(),
		result = false;

	if (scorm.isActive && API) {
		scorm.save(); // Ensure data is saved before quitting.
		switch (scorm.version) {
			case "1.2":
				result = API.LMSFinish("") === "true";
				break;
			case "2004":
				result = API.Terminate("") === "true";
				break;
		}
		if (result) {
			scorm.isActive = false;
		}
	}
	return result;
};

// ------------------------------------------------------------------------- //
// --- UTILS functions ----------------------------------------------------- //
// ------------------------------------------------------------------------- //

pipwerks.UTILS.StringToBoolean = function (string) {
	var bool;
	switch (string.toLowerCase()) {
		case "true":
		case "yes":
		case "1":
			bool = true;
			break;
		case "false":
		case "no":
		case "0":
		case null:
			bool = false;
			break;
		default:
			bool = Boolean(string);
	}
	return bool;
};
