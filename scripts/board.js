/**

* Création d'un board avec son nom

* @param {*} boardName

 * @param {*} token

 * @returns

 */

async function createBoard(boardName) {
	if (!boardName) {
		logToConsole("❌ Le nom du board est requis !");

		return;
	}

	let response = await postBoard(boardName);

	if (response.ok) {
		let board = await response.json();

		await updateBoard(board.id);

		config.board = board.id;

		let boardEl = document.querySelector("#board-selector");

		await loadBoards(boardEl);

		boardEl.value = board.id;

		for (let milestone of DEFAULT_MILESTONES) {
			let name = `${board.name} - ${milestone}`;

			await createMilestone(board.id, name);
		}

		config.milestone = null;

		setBoardSelected(board.id);

		logToConsole(`📌 Board '${board.name}' créé !`);
	} else {
		logToConsole("❌ Échec de la création du board !");
	}
}

/**

* Affiche les milestones présents sur le board

*/

async function setBoardSelected(id) {
	config.board = id;

	generateBoardLink(config.board);

	let boardLists = await fetchMilestones(id);

	const milestoneSelector = document.querySelector("#milestoneTable tbody");

	milestoneSelector.innerHTML = ""; // Réinitialisation du tableau

	for (let list of boardLists) {
		let milestone = list.milestone;

		const row = document.createElement("tr");

		row.innerHTML = `

                <td>${milestone.id}</td>

                <td><a href='${milestone.web_url}' target=_blank>${milestone.title}</a></td>

                <td milestone-id="${milestone.id}" milestone-name="${milestone.title}" class='actions-cell'>❌</td>

            `;

		milestoneSelector.appendChild(row);
	}

	addDeleteButtons();

	// Ajout des milestones dans la liste des issues

	const issueSelector = document.getElementById("issue-selector");

	issueSelector.innerHTML = "";

	for (let list of boardLists) {
		let milestone = list.milestone;

		const row = document.createElement("option");

		row.innerHTML = milestone.title;

		row.value = milestone.id;

		issueSelector.appendChild(row);
	}
}

/**

* Affiche les milestones présents dans le board

* @param {*} id  identifiant du board

*/

async function setIssueBoardSelected(id) {
	config.board = id;

	let boardLists = await fetchMilestones(id);

	const milestoneSelector = document.querySelector(
		"#issue-milestone-selector"
	);

	milestoneSelector.innerHTML = "";

	// option par défaut

	let row = document.createElement("option");

	row.setAttribute("value", 0);

	row.append("ALL");

	milestoneSelector.appendChild(row);

	for (let list of boardLists) {
		let milestone = list.milestone;

		let row = document.createElement("option");

		row.setAttribute("value", milestone.id);

		row.append(milestone.title);

		milestoneSelector.appendChild(row);
	}

	// Ajout des milestones dans la liste des issues

	const issueSelector = document.getElementById("issue-selector");

	issueSelector.innerHTML = "";

	for (let list of boardLists) {
		let milestone = list.milestone;

		const row = document.createElement("option");

		row.innerHTML = milestone.title;

		row.value = milestone.id;

		issueSelector.appendChild(row);
	}

	setMilestoneSelected("", "ALL");
}

/**

* Génère l'url pour rediriger vers le board dans Gitlab

*  @param {*} id  identifiant du board

*/

async function generateBoardLink(id) {
	let board = await fetchBoardById(id);

	let url = `${board.group.web_url}/-/boards/${id}`;

	const boardLink = document.getElementById("board-link");

	boardLink.setAttribute("href", url);

	if (boardLink.hasAttribute("href")) {
		boardLink.style.display = "inline";
	}
}

/**

* Génère les boutons pour delete un milestone

*/

function addDeleteButtons() {
	let deleteButtons = document.querySelectorAll(".actions-cell");

	for (var i = 0, len = deleteButtons.length; i < len; i++) {
		deleteButtons[i].addEventListener("click", function () {
			let id = this.getAttribute("milestone-id");

			let name = this.getAttribute("milestone-name");

			closeMilestone(id, name);
		});
	}
}
