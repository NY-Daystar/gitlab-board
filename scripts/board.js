/**
 * Create board with its name
 * @param {string} boardName board name
 * @returns
 */
async function createBoard(boardName) {
	if (!boardName) {
		logToConsole("❌ board name is required!");
		return;
	}

	const response = await postBoard(boardName);

	if (response.ok) {
		const board = await response.json();

		await updateBoard(board.id);

		config.board = board.id;
		const boardEl = document.querySelector("#board-selector");
		await loadBoards(boardEl);
		boardEl.value = board.id;

		for (const milestone of DEFAULT_MILESTONES) {
			const name = `${board.name} - ${milestone}`;
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
 * Display milestones present on board
 * @param {int} id board's id
 */
async function setBoardSelected(id) {
	config.board = id;

	generateBoardLink(config.board);

	const boardLists = await fetchMilestones(id);
	const milestoneSelector = document.querySelector("#milestoneTable tbody");
	milestoneSelector.innerHTML = ""; // Reset table

	for (const list of boardLists) {
		const milestone = list.milestone;
		const row = document.createElement("tr");
		row.innerHTML = `
                <td>${milestone.id}</td>
                <td><a href='${milestone.web_url}' target=_blank>${milestone.title}</a></td>
                <td milestone-id="${milestone.id}" milestone-name="${milestone.title}" class='actions-cell'>❌</td>
            `;
		milestoneSelector.appendChild(row);
	}

	addDeleteButtons();

	// Add milestones in issue's list
	const issueSelector = document.getElementById("issue-selector");
	issueSelector.innerHTML = "";
	for (const list of boardLists) {
		const milestone = list.milestone;
		const row = document.createElement("option");
		row.innerHTML = milestone.title;
		row.value = milestone.id;
		issueSelector.appendChild(row);
	}
}

/**
 * Display milestones present on the board
 * @param {int} id board's id
 */
async function setIssueBoardSelected(id) {
	config.board = id;
	const boardLists = await fetchMilestones(id);
	const milestoneSelector = document.querySelector(
		"#issue-milestone-selector"
	);
	milestoneSelector.innerHTML = "";

	// default option
	const option = document.createElement("option");
	option.setAttribute("value", 0);
	option.append("ALL");
	milestoneSelector.appendChild(option);
	for (const list of boardLists) {
		const milestone = list.milestone;
		const row = document.createElement("option");
		row.setAttribute("value", milestone.id);
		row.append(milestone.title);
		milestoneSelector.appendChild(row);
	}

	// Add milestones in issue's list
	const issueSelector = document.getElementById("issue-selector");
	issueSelector.innerHTML = "";
	for (const list of boardLists) {
		const milestone = list.milestone;
		const row = document.createElement("option");
		row.innerHTML = milestone.title;
		row.value = milestone.id;
		issueSelector.appendChild(row);
	}
	setMilestoneSelected("", "ALL");
}

/**
 * Generate url board
 *  @param {int} id board's id
 */

async function generateBoardLink(id) {
	const board = await fetchBoardById(id);
	const url = `${board.group.web_url}/-/boards/${id}`;
	const boardLink = document.getElementById("board-link");
	boardLink.setAttribute("href", url);
	if (boardLink.hasAttribute("href")) {
		boardLink.style.display = "inline";
	}
}

/**
 * Generate buttons to delete a milestone
 */
function addDeleteButtons() {
	const deleteButtons = document.querySelectorAll(".actions-cell");

	for (let i = 0, len = deleteButtons.length; i < len; i++) {
		deleteButtons[i].addEventListener("click", () => {
			async function closeMilestone(milestoneId, milestoneName) {
				logToConsole(
					`Delete of milestone ${milestoneName} (id: ${milestoneId})`
				);

				const confirmed = customConfirm(
					`Do you want to delete milestone ${milestoneName}`
				);
				if (!confirmed) return;

				await deleteMilestone(milestoneId)
					.then(_ => {
						setBoardSelected(
							document.querySelector(
								"#board-selector option:checked"
							).value
						);
						showToast(`Milestone '${milestoneName}' deleted`);
						logToConsole(`🛠 Milestone '${milestoneName}' deleted.`);
					})
					.catch(error => {
						logToConsole(
							`deleteMilestone - Exception raised: ${error}`
						);
					});
			}

			closeMilestone(
				this.getAttribute("milestone-id"),
				this.getAttribute("milestone-name")
			);
		});
	}
}
