/**
 * Create milestone and associate to the board
 * @param {int} boardId board to associate the milestone
 * @param {string} milestone milestone's name
 * @param {string} suffix suffix name to milestone
 */
async function createMilestone(boardId, milestone, suffix) {
	if (!milestone) {
		logToConsole("❌ Milestone's name is required !");
		return;
	}

	if (suffix) {
		milestone = `${milestone} - ${suffix}`;
	}

	let milestoneId = await postMilestone(milestone);
	if (!milestoneId) {
		logToConsole("❌ No milestone id to associate to the board");
	}

	// Associate milestone to the board
	await updateMilestone(boardId, milestoneId).then(_ => {
		setBoardSelected(boardId);
	});
}

/**
 * Create milestone by default from default list
 * @param {int} boardId board to associate the milestone
 * @param {string} suffix suffix name to milestone
 */
async function createMilestones(boardId, suffix) {
	let projects = DEFAULT_PROJECTS;

	let confirmed = confirm(
		`Do you want to create following milestones \n- ${projects.join(
			"\n- "
		)}`
	);
	if (!confirmed) return;

	for (let project of projects) {
		await createMilestone(boardId, project, suffix);
	}
}

/**
 * Display issues presents int the milestone
 * @param {int} milestoneId milestone's id (ex: 4787)
 * @param {string} milestoneName milestone's name (ex: Corpos-Christie - Release 2025)
 * @returns
 */
async function setMilestoneSelected(milestoneId, milestoneName) {
	showLoader();
	let issuesList;

	// If milestone named "ALL" then we fetch issues of all milestone
	if (milestoneName == "ALL") {
		let milestoneNames = Array.from(
			document.querySelectorAll("#issue-milestone-selector option")
		)
			.filter(
				opt =>
					opt.value > 0 &&
					DEFAULT_MILESTONES.every(
						mil => !opt.textContent.endsWith(mil)
					)
			)
			.map(opt => opt.textContent);

		issuesList = await (
			await Promise.all(
				milestoneNames.map(async m => await fetchIssues(m))
			)
		).flat();
	} else {
		issuesList = await fetchIssues(milestoneName);
	}

	config.milestone = milestoneId;
	if (!issuesList) return;

	let issueTable = document.querySelector("#issue-list tbody");
	issueTable.innerHTML = "";

	let issues = await Promise.all(
		issuesList.map(async issue => {
			let note = await fetchNoteFromIssue(issue.project_id, issue.iid);

			if (note) {
				issue.branch = extractBranchFromNote(note.body);
			}

			try {
				issue.mr = await fetchMergeRequestFromIssue(
					issue.project_id,
					issue.iid
				);

				switch (issue.mr.state) {
					case "closed":
						issue.mrState = "[CLOSED]";
						issue.mrStateClass = "state-closed";
						break;

					case "merged":
						issue.mrState = "[MERGED]";
						issue.mrStateClass = "state-merged";
						break;

					default:
						issue.mrState = "[OPEN]";
						issue.mrStateClass = "";
				}

				if (!issue.branch) issue.branch = issue.mr.source_branch;
			} catch (ex) {}

			issue.projectUrl = extractProjectUrlFromIssueUrl(issue.web_url);
			issue.projectName = extractProjectNameFromIssueUrl(issue.web_url);
			issue.branchUrl = `${issue.projectUrl}/tree/${issue.branch}`;
			return issue;
		})
	);

	issues = issues.sort((a, b) => a.projectName.localeCompare(b.projectName));

	issues = issues
		.filter(i => i.state == "opened")
		.concat(issues.filter(i => i.state != "opened"));

	// Create table
	for (let issue of issues) {
		let row = document.createElement("tr");
		row.setAttribute("id", issue.id);
		row.setAttribute("iid", issue.iid);
		row.setAttribute("projectid", issue.project_id);
		row.innerHTML = `
            <td class="issue-cell ${
				issue.state === "closed" ? "state-closed" : ""
			}"><a href="${issue.web_url}" target="_blank">${
			issue.title
		}</a></td>
            <td class=${issue.assignee ? "" : "state-closed"} >${
			issue.assignee
				? issue.assignee.name.split(" ").slice(0, 2).join(" ")
				: "Pas d'assignation"
		}</td>
            <td><a href="${issue.projectUrl}" target="_blank">${
			issue.projectName
		}</a></td>
            <td>${
				issue.branch
					? `<a href="${issue.branchUrl}" target="_blank">${issue.branch}</a>`
					: "❌ Non créée"
			}</td>
            <td class="${issue.mr ? issue.mrStateClass : ""}">
            ${
				issue.mr
					? `<a href="${issue.mr.web_url}" target="_blank">${issue.mrState} !${issue.mr.iid}</a>`
					: "❌ Non créée"
			}</td>
            <td>
                ${
					issue.state === "closed"
						? `<button class="state-closed">Clôturé</button>`
						: `<button class="state-opened close-issue" iid=${issue.iid} project="${issue.project_id}">Clôturer</button>`
				}
            </td>

        `;
		issueTable.appendChild(row);
	}

	hideLoader();
	addCloseIssuesButtons();
}

/**
 * Delete milestone with specific id, ask confirm before deleting
 * @param {int} milestoneId id of milestone to delete
 * @param {name} milestoneName milestone's name
 */
async function closeMilestone(milestoneId, milestoneName) {
	logToConsole(`Delete of milestone ${milestoneName} (id: ${milestoneId})`);

	let confirmed = confirm(`Do you want to delete milestone ${milestoneName}`);
	if (!confirmed) return;

	await deleteMilestone(milestoneId)
		.then(_ => {
			setBoardSelected(
				document.querySelector("#board-selector option:checked").value
			);
			showToast(`Milestone '${milestoneName}' deleted`);
			logToConsole(`🛠 Milestone '${milestoneName}' deleted.`);
		})
		.catch(error => {
			logToConsole(`deleteMilestone - Exception raised: ${error}`);
		});
}

/**
 * Return list of milestone to add issues
 * Add default milestone
 * @returns [Array] Milestone list with id and name
 */
function getMilestones() {
	const issueSelector = document.getElementById("issue-selector");

	const milestones = Array.from(issueSelector.selectedOptions).map(option => {
		return {
			id: option.value,
			title: option.textContent
		};
	});
	return milestones;
}
