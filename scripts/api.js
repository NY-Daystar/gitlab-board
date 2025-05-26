/**
 *  Create board with its name
 * @param {string} boardName Board name
 */
async function postBoard(boardName) {
	const url = `${GITLAB_API}/groups/${GRP}/boards?name=${boardName}`;

	try {
		const response = await fetch(url, {
			method: "POST",

			headers: { "Private-Token": config.token }
		});

		return response;
	} catch (error) {
		logToConsole(`❌fetchBoard - Error : ${error.message}`);
	}
	return null;
}

/**
 * Fetch data of the board from its id
 * @param {int} id id of board
 */
async function fetchBoardById(id) {
	const url = `${GITLAB_API}/groups/${GRP}/boards/${id}`;

	try {
		const response = await fetch(url, {
			headers: { "Private-Token": config.token }
		});

		const board = await response.json();

		if (!board) return null;

		return board;
	} catch (error) {
		logToConsole(`❌ Error : ${error.message}`);
	}
	return null;
}

/**
 *  Fetch list of board
 * @returns board's list
 */
async function fetchBoards() {
	const url = `${GITLAB_API}/groups/${GRP}/boards`;

	try {
		const response = await fetch(url, {
			headers: { "Private-Token": config.token }
		});

		const res = await response.json();

		return res;
	} catch (error) {
		logToConsole(`❌fetchBoards - Error : ${error.message}`);
	}
	return null;
}

/**
 *  Update of board - Remove issue's open and closed list
 * @param {string} boardName name of board
 */

async function updateBoard(boardId) {
	const url = `${GITLAB_API}/groups/${GRP}/boards/${boardId}?hide_backlog_list=true&hide_closed_list=true`;

	try {
		await fetch(url, {
			method: "PUT",
			headers: { "Private-Token": config.token }
		});
	} catch (error) {
		logToConsole(`❌ updateBoard - Error : ${error.message}`);
	}
	return null;
}

/**

* Create milestone with its name
* @param {string} milestone name of milestone
* @returns {int} milestone'id created
*/

async function postMilestone(milestone) {
	const url = `${GITLAB_API}/groups/${GRP}/milestones`;

	try {
		const response = await fetch(url, {
			method: "POST",

			headers: {
				"Content-Type": "application/json",
				"Private-Token": config.token
			},

			body: JSON.stringify({ title: milestone })
		});

		if (response.ok) {
			const result = await response.json();

			logToConsole(`🛠 Milestone '${milestone}' created.`);

			return result.id;
		} else {
			logToConsole(`❌ Failed to create milestone '${milestone}'`);
		}
	} catch (error) {
		logToConsole(`postMilestone - Exception raised: ${error}`);
	}
	return null;
}

/**
 * Fetch milestone from board
 * @param {*} id of board
 * @returns
 */
async function fetchMilestones(id) {
	const url = `${GITLAB_API}/groups/${GRP}/boards/${id}/lists`;

	try {
		const response = await fetch(url, {
			headers: { "Private-Token": config.token }
		});

		const milestones = await response.json();
		if (!milestones) return null;

		return milestones;
	} catch (error) {
		logToConsole(`❌ Erreur : ${error.message}`);
	}
	return null;
}

/**
 * Update milestone - Associate to the board
 * @param {int} boardId id of board
 * @param {int} milestoneId id of milestone
 */
async function updateMilestone(boardId, milestoneId) {
	const url = `${GITLAB_API}/groups/${GRP}/boards/${boardId}/lists?milestone_id=${milestoneId}`;

	try {
		const response = await fetch(url, {
			method: "POST",

			headers: {
				"Content-Type": "application/json",
				"Private-Token": config.token
			}
		});

		if (response.ok) {
			logToConsole("🛠 Milestone associated to the board.");
		} else {
			logToConsole("❌ Failed association board/milestone");
		}
	} catch (error) {
		logToConsole(`updateMilestone - Exception raised: ${error}`);
	}
	return null;
}

/**
 * Delete milestone on gitlab le milestone
 * @param {int} milestoneId id of milestone
 */
async function deleteMilestone(milestoneId) {
	const url = `${GITLAB_API}/groups/${GRP}/milestones/${milestoneId}`;

	try {
		const response = await fetch(url, {
			method: "DELETE",

			headers: {
				"Content-Type": "application/json",
				"Private-Token": config.token
			}
		});

		if (response.ok) {
			return response;
		} else {
			logToConsole(`❌ Failed to delete milestone '${milestone}'`);
		}
	} catch (error) {
		logToConsole(`deleteMilestone - Exception raised: ${error}`);
	}
	return null;
}

/**
 * Create issue with its name, milestone associated and its priority
 * @param {int} projectId id of repository where issue to be found
 * @param {string} issue name of the issue
 * @param {int} milestoneId id of milestone associate to the issue
 * @param {string} priority  values possible (low, medium, high)
 */
async function postIssue(projectId, issue, milestoneId, priority) {
	const url = `${GITLAB_API}/projects/${projectId}/issues?title=${issue}&milestone_id=${milestoneId}&labels=${priority}`;

	try {
		const response = await fetch(url, {
			method: "POST",

			headers: {
				"Content-Type": "application/json",
				"Private-Token": config.token
			}
		});

		if (response.ok) {
			logToConsole(`🛠 issue '${issue}' create.`);
		} else {
			logToConsole(`❌ Failed to create issue '${issue}'`);
		}
	} catch (error) {
		logToConsole(`postIssue - Exception raised: ${error}`);
	}
	return null;
}

/**
 * Fetch issues of milestone
 * @param {string} milestoneName milestone's name
 */
async function fetchIssues(milestoneName) {
	try {
		const response = await fetch(
			`${GITLAB_API}/issues?scope=all&milestone=${milestoneName}`,
			{
				headers: { "Private-Token": config.token }
			}
		);

		const issues = await response.json();

		if (!issues) return null;

		return issues;
	} catch (error) {
		logToConsole(`❌ fetchIssues - Error : ${error.message}`);
	}
	return null;
}

/**
 * Fetch first merge request of issue
 * @param {int} projectId id of repository
 * @param {int} issueIid id of the issue relative to repository (iid)
 */
async function fetchMergeRequestFromIssue(projectId, issueIid) {
	try {
		const response = await fetch(
			`${GITLAB_API}/projects/${projectId}/issues/${issueIid}/related_merge_requests`,
			{
				headers: { "Private-Token": config.token }
			}
		);

		const mergeRequests = await response.json();

		if (!mergeRequests) return null;

		return mergeRequests[0];
	} catch (error) {
		logToConsole(`❌ Error : ${error.message}`);
	}
	return null;
}

/**
 * Fetch notes from issue
 * @param {int} projectId id of repository
 * @param {int} issueIid id of the issue relative to repository (iid)
 */
async function fetchNoteFromIssue(projectId, issueIid) {
	try {
		const response = await fetch(
			`${GITLAB_API}/projects/${projectId}/issues/${issueIid}/notes`,
			{
				headers: { "Private-Token": config.token }
			}
		);

		const notes = await response.json();

		if (!notes) return null;

		return notes[0];
	} catch (error) {
		logToConsole(`❌ fetchNoteFromIssue - Error : ${error.message}`);
	}
	return null;
}

/**
 * Update issue - modify status to close
 * @param {int} projectId id of repository
 * @param {int} issueIid id of the issue relative to repository (iid)
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
		logToConsole(`❌ updateIssue - Error : ${error.message}`);
	}
	return null;
}

/**
 *
 * Fetch all repository approaching by the name
 * @param {string} projectName name of repository seeked
 */
async function fetchRepository(projectName) {
	const url = `${GITLAB_API}/projects?search=${encodeURIComponent(
		projectName
	)}`;

	try {
		const response = await fetch(url, {
			method: "GET",

			headers: {
				"Content-Type": "application/json",
				"Private-Token": config.token
			}
		});

		if (!response.ok) {
			throw new Error(`Erreur API: ${response.statusText}`);
		}

		const projects = await response.json();

		if (projects.length === 0) {
			logToConsole("❌ Aucun dépôt trouvé.");
			return null;
		}

		return projects;
	} catch (error) {
		console.error("❌ Erreur lors de la recherche du dépôt:", error);
	}
	return null;
}
