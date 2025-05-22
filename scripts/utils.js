/**

* Extrait de la milestone le nom du projet gitlab

* @param {str} milestone (QUAL_CORE - Release Water 2025)

* @returns QUAL_CORE

*/

function extractProject(milestone) {
	const regexp = /(.*)\s+-\s+.*/g;

	try {
		const matches = milestone.matchAll(regexp);

		for (const match of matches) {
			return match[1];
		}
	} catch (ex) {
		return null;
	}
}

/**

* Extrait de le nom du projet depuis l'url d'une issue
* @param {string} url
*/

function extractProjectNameFromIssueUrl(url) {
	const regexp = /\/(\w+)(?=\/-\/issues)/g;

	const matches = url.matchAll(regexp);

	for (const match of matches) {
		return match[1];
	}
}

/**

* Extrait de le nom du projet depuis l'url d'une issue
* @param {string} url
*/

function extractProjectUrlFromIssueUrl(url) {
	const regexp = /(.*)(?=\/-\/issues)/g;

	const matches = url.matchAll(regexp);

	for (const match of matches) {
		return match[1];
	}
}

/**
 * Extrait de le nom de le branche depuis les notes d'une issue
 * @param {string} content
 */

function extractBranchFromNote(content) {
	const regexp = /\[`(.*)\`]/g;

	const matches = content.matchAll(regexp);

	for (const match of matches) {
		return match[1];
	}
}

/**

* Extrait la version semver d'un contenu

* @param {string} content ex: var PROJECT_VERSION = "1.4.0"

* @returns 1.4.0

*/

function extractVersion(content) {
	const regexp = /PROJECT_VERSION\s=\s"(.*)"/g;

	const matches = content.matchAll(regexp);

	for (const match of matches) {
		return match[1];
	}
}

/**

* Compare 2 version semver

* @param {string} v1 ex: "1.4.0"

* @param {string} v2 ex: "1.5.0"

* @returns -1 v1<v2  | 1 si v1>v2  |  0 si v1=v2

*/

function compareVersion(v1, v2) {
	(v1parts = v1.split(".")), (v2parts = v2.split("."));

	function isValidPart(x) {
		return /^\d+[A-Za-z]*$/;
	}

	if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
		return NaN;
	}

	for (var i = 0; i < v1parts.length; ++i) {
		if (v2parts.length == i) {
			return 1;
		}

		if (v1parts[i] == v2parts[i]) {
			continue;
		} else if (v1parts[i] > v2parts[i]) {
			return 1;
		} else {
			return -1;
		}
	}

	if (v1parts.length != v2parts.length) {
		return -1;
	}

	return 0;
}
