document.addEventListener("DOMContentLoaded", async () => {
	handleTab();

	setTab();

	loadParams();

	handleDebug();

	loadVersion();

	logToConsole(JSON.stringify(config), "dir");

	document.getElementById("project-version").textContent = PROJECT_VERSION;

	logToConsole("Authenticate");

	let checked = await authenticate();

	logToConsole("Fin authentification");

	if (!checked) return;
});

/**

* Chargement des données lors d'un changement d'onglet

*/

async function loadData() {
	logToConsole("Chargement des boards dans le dashboard", "time");

	await loadBoards(document.getElementById("board-selector"));

	logToConsole("Chargement des boards dans le dashboard", "timeEnd");

	logToConsole("Chargement des boards dans les issues", "time");

	await loadBoards(document.getElementById("issue-board-selector"));

	logToConsole("Chargement des boards dans les issues", "timeEnd");

	// Charge les milestone du board par défaut

	if (config.board) {
		document.getElementById("board-selector").value = config.board;

		setBoardSelected(config.board);

		document.getElementById("issue-board-selector").value = config.board;

		await setIssueBoardSelected(config.board);
	}

	// Charge les issue du milestone par défaut

	if (config.milestone) {
		document.getElementById("issue-milestone-selector").value =
			config.milestone;

		let milestone = document.querySelector(
			"#issue-milestone-selector option:checked"
		);

		if (milestone)
			setMilestoneSelected(config.milestone, milestone.textContent);
	}
}

/**

* Charge les boards dans l'IHM dans le selecteur

 */

async function loadBoards(element) {
	element.innerHTML = ""; // Remise à 0 des options

	let boards = await fetchBoards();

	for (const board of boards) {
		let row = document.createElement("option");

		row.setAttribute("value", board.id);

		row.append(board.name);

		element.append(row);
	}
}

/**

* Gestion des onglets pour la navigation

*/

function handleTab() {
	const buttons = document.querySelectorAll(".tab-button");

	const contents = document.querySelectorAll(".tab-content");

	buttons.forEach(button => {
		button.addEventListener("click", () => {
			contents.forEach(content => (content.style.display = "none"));

			document.getElementById(button.dataset.tab).style.display = "block";

			config.currentTab = button.getAttribute("data-tab");

			loadData();
		});
	});

	// Afficher le premier onglet au démarrage

	document.getElementById("dashboard").style.display = "block";
}

/**

* Recharge le dernier onglet consulté

*/

function setTab() {
	if (!config.currentTab) return;

	const buttons = Array.from(document.querySelectorAll(".tab-button"));

	var button = buttons.find(
		btn => btn.getAttribute("data-tab") == config.currentTab
	);

	if (!button) return;

	button.click();
}

/**

* Gestion du debug

*/

function handleDebug() {
	let debugMode = config.debug;

	let consoleDiv = document.getElementById("consoleLog");

	if (!debugMode) consoleDiv.style.display = "none";
}
