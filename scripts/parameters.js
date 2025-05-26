/**
 * Load gitlab token and debug mode value from configuration
 */
function loadParams() {
	const tokenInput = document.getElementById("token-input");
	tokenInput.value = config.token;

	const switchDebug = document.getElementById("switch-debug");
	const debugMode = config.debug;
	switchDebug.checked = debugMode;
}

/**
 * Save gitlab token
 */
function saveToken() {
	const inputToken = document.getElementById("token-input");
	config.token = inputToken.value;
	logToConsole("Changement de token");

	window.location.reload();
}

/**
 * Switch between normal mode or debug mode
 */
function toggleDebug() {
	const switchDebug = document.getElementById("switch-debug");
	config.debug = switchDebug.checked;

	logToConsole(
		`Mode débug : ${switchDebug.checked ? "Activé" : "Désactivé"}`
	);

	const console = document.getElementById("consoleLog");
	console.style.display = switchDebug.checked ? "block" : "none";
}

/**
 * Check if a new version is available
 * @returns
 */
async function loadVersion() {
	try {
		const response = await fetch(
			"https://github.com/NY-Daystar/gitlab-board",
			{
				headers: { "Private-Token": config.token }
			}
		);

		const content = await response.text();
		const prodVersion = extractVersion(content);

		if (compareVersion(PROJECT_VERSION, prodVersion) === -1) {
			customAlert(
				`A new version is available\n\tActual version : ${PROJECT_VERSION}\n\tNew version: ${prodVersion}`
			);

			document.getElementById("new-version").textContent = prodVersion;
			document.getElementById("update-link").style.display =
				"inline-block";
		}
	} catch (error) {
		logToConsole(`❌ loadVersion : ${error.message}`);
	}
	return null;
}
