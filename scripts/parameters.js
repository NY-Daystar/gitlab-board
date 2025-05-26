/**
 * Load gitlab token and debug mode value from configuration
 */
function loadParams() {
	let tokenInput = document.getElementById("token-input");
	tokenInput.value = config.token;

	let switchDebug = document.getElementById("switch-debug");
	let debugMode = config.debug;
	switchDebug.checked = debugMode;
}

/**
 * Save gitlab token
 */
function saveToken() {
	let inputToken = document.getElementById("token-input");
	config.token = inputToken.value;
	logToConsole("Changement de token");

	window.location.reload();
}

/**
 * Switch between normal mode or debug mode
 */
function toggleDebug() {
	let switchDebug = document.getElementById("switch-debug");
	config.debug = switchDebug.checked;

	logToConsole(
		`Mode débug : ${switchDebug.checked ? "Activé" : "Désactivé"}`
	);

	let console = document.getElementById("consoleLog");
	console.style.display = switchDebug.checked ? "block" : "none";
}

/**
 * Check if a new version is available
 * @returns
 */
async function loadVersion() {
	try {
		let response = await fetch(
			"https://github.com/NY-Daystar/gitlab-board",
			{
				headers: { "Private-Token": config.token }
			}
		);

		let content = await response.text();
		let prodVersion = extractVersion(content);

		if (compareVersion(PROJECT_VERSION, prodVersion) == -1) {
			alert(
				`A new version is available\n\tActual version : ${PROJECT_VERSION}\n\tNew version: ${prodVersion}`
			);

			document.getElementById("new-version").textContent = prodVersion;
			document.getElementById("update-link").style.display =
				"inline-block";
		}
	} catch (error) {
		logToConsole(`❌ loadVersion : ${error.message}`);
		return null;
	}
}
