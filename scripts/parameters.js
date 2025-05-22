/**

* Charge le token gitlab et le mode debug

*/

function loadParams() {
	let tokenInput = document.getElementById("token-input");

	tokenInput.value = config.token;

	let switchDebug = document.getElementById("switch-debug");

	let debugMode = config.debug;

	switchDebug.checked = debugMode;
}

/**

* Sauvegarde le token gitlab

 */

function saveToken() {
	let inputToken = document.getElementById("token-input");

	config.token = inputToken.value;

	logToConsole("Changement de token");

	window.location.reload();
}

/**

* Sauvegarde le mode debug ou normal

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

* Regarde si une nouvelle version est disponible de l'application

* @returns

 */

async function loadVersion() {
	try {
		let response = await fetch(
			"https://gitlab.cm-cic.fr/api/v4/projects/4616/repository/files/git_board%2Fscripts%2Fconstants%2Ejs/raw?ref=main",
			{
				headers: { "Private-Token": config.token }
			}
		);

		let content = await response.text();

		let prodVersion = extractVersion(content);

		if (compareVersion(PROJECT_VERSION, prodVersion) == -1) {
			alert(
				`Une nouvelle version est disponible\n\tVersion actuel  : ${PROJECT_VERSION}\n\tNouvelle version: ${prodVersion}\n\nÉtapes pour faire la mise à jour \n\t1. Ouvrir un terminal git bash puis 'cd /c/PRIV/Projects/APP_TOOLS'\n\t2. Mettre à jour avec la commande 'git pull'\n\t3. Recharger la page`
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
