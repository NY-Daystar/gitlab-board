/**
 * Extract from milestone repository
 * @param {str} milestone (Corpos-Christie - Release 2025)
 * @returns Corpos-Christie
 */
function extractProject(milestone) {
	const regexp = /(.*)\s+-\s+.*/g;
	const matches = milestone.matchAll(regexp);
	for (const match of matches) {
		return match[1];
	}
	return null;
}

/**
 * Extract name of project from issue's url
 * @param {string} url
 */
function extractProjectNameFromIssueUrl(url) {
	const regexp = /\/(\w+)(?=\/-\/issues)/g;
	const matches = url.matchAll(regexp);
	for (const match of matches) {
		return match[1];
	}
	return null;
}

/**
 * Extract url of projet from issue's url
 * @param {string} url
 */
function extractProjectUrlFromIssueUrl(url) {
	const regexp = /(.*)(?=\/-\/issues)/g;
	const matches = url.matchAll(regexp);
	for (const match of matches) {
		return match[1];
	}
	return null;
}

/**
 * Extract branch name from issue's note
 * @param {string} content
 */
function extractBranchFromNote(content) {
	const regexp = /\[(.*)\]/g;
	const matches = content.matchAll(regexp);
	for (const match of matches) {
		return match[1];
	}
	return null;
}

/**
 * Extract SemVer version of content
 * @param {string} content ex: var PROJECT_VERSION = "1.4.0"
 * @returns 1.4.0
 */
function extractVersion(content) {
	const regexp = /PROJECT_VERSION\s=\s"(.*)"/g;
	const matches = content.matchAll(regexp);
	for (const match of matches) {
		return match[1];
	}
	return null;
}

/**
 * Compare 2 SemVer version
 * @param {string} v1 ex: "1.4.0"
 * @param {string} v2 ex: "1.5.0"
 * @returns -1 v1<v2  | 1 si v1>v2  |  0 si v1=v2
 */
function compareVersion(v1, v2) {
	const v1parts = v1.split(".");
	const v2parts = v2.split(".");

	function isValidPart(x) {
		return /^\d+[A-Za-z]*$/;
	}

	if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
		return NaN;
	}

	for (let i = 0; i < v1parts.length; ++i) {
		if (v2parts.length === i) {
			return 1;
		}
		if (v1parts[i] === v2parts[i]) {
			continue;
		} else if (v1parts[i] > v2parts[i]) {
			return 1;
		} else {
			return -1;
		}
	}

	if (v1parts.length !== v2parts.length) {
		return -1;
	}

	return 0;
}

/**
 * Generate alert popup
 * @param {string} msg message of the alert
 */
function customAlert(msg) {
	alert(msg);
}

/**
 * Generate confirm popup
 * @param {string} msg message of the confirm
 */
function customConfirm(msg) {
	const confirmed = confirm(msg);
	return confirmed;
}
