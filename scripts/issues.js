document.addEventListener("DOMContentLoaded", () => {
	const issueSelector = document.getElementById("issue-selector");
	const issueCreateBtn = document.getElementById("issue-create");
	const resetBtn = document.getElementById("reset-projects");
	const milestoneValuesList = document.getElementById("selectedValues");

	// Reset selection
	resetBtn.addEventListener("click", () => {
		issueSelector.selectedIndex = -1; // Deselect all
		Array.from(issueSelector.options).forEach(
			option => (option.selected = false)
		);
	});

	issueCreateBtn.addEventListener("click", () => {
		const milestoneSelected = Array.from(issueSelector.selectedOptions).map(
			option => option.value
		);

		const priority = document.querySelector(
			'input[name="priority"]:checked'
		).value;

		milestoneValuesList.innerHTML = "";
		if (milestoneSelected.length === 0) {
			milestoneValuesList.innerHTML = "<li>No sélection</li>";
		}

		milestoneSelected.forEach(milestoneId => {
			const milestoneName = document.querySelector(
				`#issue-selector > option[value="${milestoneId}"]`
			).textContent;
			const li = document.createElement("li");
			li.textContent = milestoneName;
			milestoneValuesList.appendChild(li);
		});

		const issueName = document.getElementById("issue-name").value;
		const milestones = getMilestones();

		createIssues(milestones, issueName, priority)
			.then(_ => {
				showToast(
					`Issue '${issueName}' created for project<ul>${milestones
						.map(m => `<li>${m.title}</li>`)
						.join("")}</ul>`
				);
			})
			.catch(error => {
				showToast(`These issues can't created : ${error}`, "error");
				logToConsole(error);
			});

		// Reset projects and name of issue
		resetBtn.click();
		document.getElementById("issue-name").value = "";
		document.querySelector('input[value="priority::low"]').checked = true;
	});
});

/**
 * Create issue for each milestone
 * @param {list} milestones milestone list where create issue (id and name)
 * @param {string} issue name of the issue
 * @param {string} priority issue's priority (low, medium, high)
 * @returns {bool} false is error raised
 */
async function createIssues(milestones, issue, priority) {
	if (!milestones.length) {
		const msg = "error: No milestone to create issues";
		logToConsole(msg);
		throw msg;
	}

	if (!issue) {
		const msg = "error: Issue name empty";
		logToConsole(msg);
		throw msg;
	}

	for (const milestone of milestones) {
		await createIssue(milestone, issue, priority);
	}
	return true;
}

/**
 * Create issue and link to milestone
 * @param {object} milestone metadata on milestone
 * @param {string} issue issue's name
 * @param {string} priority issue's priority (low, medium, high)
 */
async function createIssue(milestone, issue, priority) {
	let projectToFind = extractProject(milestone.title);
	if (!projectToFind) projectToFind = PRJ;

	logToConsole(`Gitlab Project : ${projectToFind}`);
	let gitlabProject = await searchGitLabProject(projectToFind);
	logToConsole(`Project found on gitlab: ${gitlabProject}`);

	// by default if not found
	if (!gitlabProject) {
		gitlabProject = PRJ;
	}

	const result = await postIssue(
		gitlabProject,
		issue,
		milestone.id,
		priority
	);
	return result;
}

/**
 * Search project associate to the issue
 * @param {string} projectName name of the project
 * @returns
 */
function searchGitLabProject(projectName) {
	return fetchRepository(projectName)
		.then(projects => {
			const bestMatch = projects.find(p => p.name === projectName);
			logToConsole(
				`✅ Repo found: ${bestMatch.name} (ID: ${bestMatch.id})`
			);
			return bestMatch.id;
		})
		.catch(error => {
			logToConsole(`❌ searchGitLabProject Error : ${error.message} `);
		});
}

/**
 * Event to close issue
 */
const deleteIssueEvent = ({ target }) => {
	const iid = target.getAttribute("iid");
	const projectId = target.getAttribute("project");
	closeIssue(projectId, iid);
};

/**
 * Generate buttons to close issue
 */
function addCloseIssuesButtons() {
	const deleteButtons = document.querySelectorAll(".close-issue");
	for (let i = 0, len = deleteButtons.length; i < len; i++) {
		deleteButtons[i].addEventListener("click", deleteIssueEvent);
	}
}

/**
 * Close issue
 * @param {int} projectId id of repository where to find issue
 * @param {int} issueIid iid of the issue
 * @returns
 */
async function closeIssue(projectId, issueIid) {
	logToConsole(`Closing issue ${issueIid} (project_id: ${projectId})`);

	const confirmed = customConfirm("Do you want to close the issue ?");
	if (!confirmed) return;

	await updateIssue(projectId, issueIid)
		.then(response => {
			if (response.ok) {
				const issuesEl = document.getElementById("issue-list");

				const issueEl = issuesEl.querySelector(
					`tr[projectid="${projectId}"][iid="${issueIid}"]`
				);
				const issueCell = issueEl.querySelector(".issue-cell");
				issueCell.classList.add("state-closed");

				const btn = issueEl.querySelector(".close-issue");
				btn.classList.remove("state-opened");
				btn.classList.add("state-closed");
				btn.textContent = "Closed";
				btn.removeEventListener("click", deleteIssueEvent);
				showToast(`Issue '${issueCell.textContent}' closed`);
			}
		})
		.catch(error => {
			logToConsole(`closeIssue - Exception raised: ${error}`);
		});
}
