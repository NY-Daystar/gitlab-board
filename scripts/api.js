/**

*  Créer le nom du board avec son nom

* @param {string} boardName nom du board

*/

async function postBoard(boardName) {
	const url = `${GITLAB_API}/groups/${GRP}/boards?name=${boardName}`;

	try {
		let response = await fetch(url, {
			method: "POST",

			headers: { "Private-Token": config.token }
		});

		return response;
	} catch (error) {
		logToConsole(`❌fetchBoard - Erreur : ${error.message}`);

		return null;
	}
}

/**

* Récupère les données sur le board avec son id

* @param {int} id identifiant du board

*/

async function fetchBoardById(id) {
	const url = `${GITLAB_API}/groups/${GRP}/boards/${id}`;

	try {
		let response = await fetch(url, {
			headers: { "Private-Token": config.token }
		});

		let board = await response.json();

		if (!board) return;

		return board;
	} catch (error) {
		logToConsole(`❌ Erreur : ${error.message}`);

		return null;
	}
}

/**

*  Recherche la liste des boards dans le groupe Y340

* @returns tableau des boards

*/

async function fetchBoards() {
	const url = `${GITLAB_API}/groups/${GRP}/boards`;

	try {
		let response = await fetch(url, {
			headers: { "Private-Token": config.token }
		});

		let res = await response.json();

		return res;
	} catch (error) {
		logToConsole(`❌fetchBoards - Erreur : ${error.message}`);

		return null;
	}
}

/**

*  Mise à jour du board - on retire la liste des issues opened et closed

* @param {string} boardName nom du board

*/

async function updateBoard(boardId) {
	const url = `${GITLAB_API}/groups/${GRP}/boards/${boardId}?hide_backlog_list=true&hide_closed_list=true`;

	try {
		await fetch(url, {
			method: "PUT",

			headers: { "Private-Token": config.token }
		});
	} catch (error) {
		logToConsole(`❌ updateBoard -  Erreur : ${error.message}`);

		return null;
	}
}

/**

* Création d'un milestone avec son nom

* @param {string} milestone nom du milestone

* @returns {int} id du milestone crée

*/

async function postMilestone(milestone) {
	let url = `${GITLAB_API}/groups/${GRP}/milestones`;

	try {
		let response = await fetch(url, {
			method: "POST",

			headers: {
				"Content-Type": "application/json",

				"Private-Token": config.token
			},

			body: JSON.stringify({ title: milestone })
		});

		if (response.ok) {
			let result = await response.json();

			logToConsole(`🛠 Milestone '${milestone}' créée.`);

			return result.id;
		} else {
			logToConsole(
				`❌ Échec de la création de la milestone '${milestone}'`
			);
		}
	} catch (error) {
		logToConsole(`postMilestone - Exception levé: ${error}`);
	}
}

/**

* Récupère que les milestone depuis un board

*/

async function fetchMilestones(id) {
	const url = `${GITLAB_API}/groups/${GRP}/boards/${id}/lists`;

	try {
		let response = await fetch(url, {
			headers: { "Private-Token": config.token }
		});

		let milestones = await response.json();

		if (!milestones) return;

		return milestones;
	} catch (error) {
		logToConsole(`❌ Erreur : ${error.message}`);

		return null;
	}
}

/**

* Mise à jour d'un milestone nottamment en l'associant au board

* @param {int} boardId identifiant du board

 * @param {int} milestoneId identifiant du milestone

*/

async function updateMilestone(boardId, milestoneId) {
	const url = `${GITLAB_API}/groups/${GRP}/boards/${boardId}/lists?milestone_id=${milestoneId}`;

	try {
		let response = await fetch(url, {
			method: "POST",

			headers: {
				"Content-Type": "application/json",

				"Private-Token": config.token
			}
		});

		if (response.ok) {
			logToConsole(`🛠 Milestone associé au board.`);
		} else {
			logToConsole(`❌ Échec de l'association board/milestone`);
		}
	} catch (error) {
		logToConsole(`updateMilestone - Exception levé: ${error}`);
	}
}

/**

* Supprime le milestone de gitlab

* @param {int} milestoneId identifiant du milestone

*/

async function deleteMilestone(milestoneId) {
	const url = `${GITLAB_API}/groups/${GRP}/milestones/${milestoneId}`;

	try {
		let response = await fetch(url, {
			method: "DELETE",

			headers: {
				"Content-Type": "application/json",

				"Private-Token": config.token
			}
		});

		if (response.ok) {
			return response;
		} else {
			logToConsole(
				`❌ Échec de la suppression du milestone '${milestone}'`
			);
		}
	} catch (error) {
		logToConsole(`deleteMilestone - Exception levé: ${error}`);
	}
}

/**

*

 * Création d'une issue avec son nom, son milestone associé et sa priority

* @param {int} projectId identifiant dans lequel se retrouvera l'issue

* @param {string} issue nom de l'issue

* @param {int} milestoneId identifiant du milestone auquel rattaché l'issue

* @param {string} priority  valeurs possibles (low, medium, high)

*/

async function postIssue(projectId, issue, milestoneId, priority) {
	const url = `${GITLAB_API}/projects/${projectId}/issues?title=${issue}&milestone_id=${milestoneId}&labels=${priority}`;

	try {
		let response = await fetch(url, {
			method: "POST",

			headers: {
				"Content-Type": "application/json",

				"Private-Token": config.token
			}
		});

		if (response.ok) {
			logToConsole(`🛠 issue '${issue}' créée.`);
		} else {
			logToConsole(`❌ Échec de la création de l'issue '${issue}'`);
		}
	} catch (error) {
		logToConsole(`postIssue - Exception levé: ${error}`);
	}
}

/**

* Recupère les issues d'un milestone sous forme de tableau

* @param {string} nom du milestone

 */

async function fetchIssues(milestoneName) {
	try {
		let response = await fetch(
			`${GITLAB_API}/issues?scope=all&milestone=${milestoneName}`,
			{
				headers: { "Private-Token": config.token }
			}
		);

		let issues = await response.json();

		if (!issues) return;

		return issues;
	} catch (error) {
		logToConsole(`❌ fetchIssues - Erreur : ${error.message}`);

		return null;
	}
}

/**

* Recupère la première merge request d'une issue

* @param {int} projectId identifiant du dépôt gitlab

* @param {int} issueIid identifiant de l'issue relative au dépôt gitlab

*/

async function fetchMergeRequestFromIssue(projectId, issueIid) {
	try {
		let response = await fetch(
			`${GITLAB_API}/projects/${projectId}/issues/${issueIid}/related_merge_requests`,
			{
				headers: { "Private-Token": config.token }
			}
		);

		let mergeRequests = await response.json();

		if (!mergeRequests) return;

		return mergeRequests[0];
	} catch (error) {
		logToConsole(`❌ Erreur : ${error.message}`);

		return null;
	}
}

/**

* Recupère les notes provenant de l'issue

* @param {int} projectId identifiant du dépôt gitlab

* @param {int} issueIid identifiant de l'issue relative au dépôt gitlab

*/

async function fetchNoteFromIssue(projectId, issueIid) {
	try {
		let response = await fetch(
			`${GITLAB_API}/projects/${projectId}/issues/${issueIid}/notes`,
			{
				headers: { "Private-Token": config.token }
			}
		);

		let notes = await response.json();

		if (!notes) return;

		return notes[0];
	} catch (error) {
		logToConsole(`❌ fetchNoteFromIssue - Erreur : ${error.message}`);

		return null;
	}
}

/**

* Met à jour l'issue en modifiant son statut à closed

* @param {int} projectId identifiant du dépôt gitlab

* @param {int} issueIid identifiant de l'issue relative au dépôt gitlab

*/

async function updateIssue(projectId, issueIid) {
	const url = `${GITLAB_API}/projects/${projectId}/issues/${issueIid}?state_event=close`;

	try {
		return await fetch(url, {
			method: "PUT",

			headers: {
				"Content-Type": "application/json",

				"Private-Token": config.token
			}
		});
	} catch (error) {
		logToConsole(`❌ updateIssue - Erreur : ${error.message}`);

		return null;
	}
}

/**

*

 * Récupère l'ensemble des dépots gitlab s'approchant du nom de projet recherché

* @param {string} projectName nom des repository à recherché

*/

async function fetchRepository(projectName) {
	const url = `${GITLAB_API}/projects?search=${encodeURIComponent(
		projectName
	)}`;

	try {
		let response = await fetch(url, {
			method: "GET",

			headers: {
				"Content-Type": "application/json",

				"Private-Token": config.token
			}
		});

		if (!response.ok) {
			throw new Error(`Erreur API: ${response.statusText}`);
		}

		let projects = await response.json();

		if (projects.length === 0) {
			logToConsole("❌ Aucun dépôt trouvé.");

			return null;
		}

		return projects;
	} catch (error) {
		console.error("❌ Erreur lors de la recherche du dépôt:", error);

		return null;
	}
}
