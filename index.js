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
 * Load data when switch tab
 */
async function loadData() {
	logToConsole("Load board in app", "time");
	await loadBoards(document.getElementById("board-selector"));
	logToConsole("Load board in app", "timeEnd");

	logToConsole("Load board in issues", "time");
	await loadBoards(document.getElementById("issue-board-selector"));
	logToConsole("Load board in issues", "timeEnd");

	// Load milestone's board by default
	if (config.board) {
		document.getElementById("board-selector").value = config.board;
		setBoardSelected(config.board);
		document.getElementById("issue-board-selector").value = config.board;
		await setIssueBoardSelected(config.board);
	}

	// Load issues from milestone by default
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
 * Load board in GUI
 */
async function loadBoards(element) {
	element.innerHTML = ""; // Reset options

	let boards = await fetchBoards();

	for (const board of boards) {
		let row = document.createElement("option");
		row.setAttribute("value", board.id);
		row.append(board.name);
		element.append(row);
	}
}

/**
 * Handle tabs for navigation
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

	// Display first tab at start application
	document.getElementById("dashboard").style.display = "block";
}

/**
 * Reload last tab viewed
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
 * Handle display debug mode
 */
function handleDebug() {
	let debugMode = config.debug;
	let consoleDiv = document.getElementById("consoleLog");
	if (!debugMode) consoleDiv.style.display = "none";
}
