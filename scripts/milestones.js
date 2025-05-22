/**

* Créer un milestone et l'associe au board ciblé

* @param {*} boardId board auquel associer le milestone

* @param {*} milestone  nom du milestone

* @param {*} suffix si besoin d'ajouter un suffixe au milestone

*/

async function createMilestone(boardId, milestone, suffix) {
	if (!milestone) {
		logToConsole("❌ Le nom du milestone est requis !");

		return;
	}

	if (suffix) {
		milestone = `${milestone} - ${suffix}`;
	}

	let milestoneId = await postMilestone(milestone);

	if (!milestoneId) {
		logToConsole("❌ Pas de milestone id pour l'associer au board");
	}

	// Association de la milestone au board

	await updateMilestone(boardId, milestoneId).then(_ => {
		setBoardSelected(boardId);
	});
}

/**

* Créer les milestons par défaut à partir de la liste présents dans les constantes

* @param {*} boardId board auquel associer le milestone

* @param {*} suffix si besoin d'ajouter un suffixe au milestone

*/

async function createMilestones(boardId, suffix) {
	let projects = DEFAULT_PROJECTS;

	let confirmed = confirm(
		`Voulez-vous créer les milestones suivants \n- ${projects.join("\n- ")}`
	);

	if (!confirmed) return;

	for (let project of projects) {
		await createMilestone(boardId, project, suffix);
	}
}

/**

* Affiche les issues présents dans le milestone

* @param {int} milestoneId identifiant du milestone (ex: 4787)

* @param {string} milestoneName nom du milestone (ex: QUAL_CORE - Release Water 2025)

* @returns

 */

async function setMilestoneSelected(milestoneId, milestoneName) {
	showLoader();

	let issuesList;

	// Si le milestone est nommé ALL alors on fetch les issues de toutes les milestones

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

	// Création du tableau

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

* Supprime le milestone avec l'id en question

* exerce un confirm avant de poursuivre la suppression

* @param {int} milestoneId identifiant du milestone à supprimer

 * @param {name} milestoneName nom du milestone

*/

async function closeMilestone(milestoneId, milestoneName) {
	logToConsole(
		`Suppression du milestone ${milestoneName} (id: ${milestoneId})`
	);

	let confirmed = confirm(
		`Voulez-vous supprimer le milestone ${milestoneName}`
	);

	if (!confirmed) return;

	await deleteMilestone(milestoneId)
		.then(_ => {
			setBoardSelected(
				document.querySelector("#board-selector option:checked").value
			);

			showToast(`Milestone '${milestoneName}' supprimé`);

			logToConsole(`🛠 Milestone '${milestoneName}' supprimé.`);
		})
		.catch(error => {
			logToConsole(`deleteMilestone - Exception levé: ${error}`);
		});
}

/**

* renvoie la liste des milestone pour ajouter l'issue

* Ajoute un milestone par défaut

* @returns [Array] liste des milestone avec id et nom

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
