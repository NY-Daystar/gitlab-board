document.addEventListener("DOMContentLoaded", () => {
	let issueSelector = document.getElementById("issue-selector");

	const issueCreateBtn = document.getElementById("issue-create");

	const resetBtn = document.getElementById("reset-projects");

	const milestoneValuesList = document.getElementById("selectedValues");

	// Réinitialiser la sélection

	resetBtn.addEventListener("click", () => {
		issueSelector.selectedIndex = -1; // Désélectionner tout

		Array.from(issueSelector.options).forEach(
			option => (option.selected = false)
		);
	});

	issueCreateBtn.addEventListener("click", async () => {
		let milestoneSelected = Array.from(issueSelector.selectedOptions).map(
			option => option.value
		);

		let priority = document.querySelector(
			'input[name="priority"]:checked'
		).value;

		milestoneValuesList.innerHTML = "";

		if (milestoneSelected.length === 0) {
			milestoneValuesList.innerHTML = "<li>Aucune sélection</li>";
		}

		milestoneSelected.forEach(milestoneId => {
			let milestoneName = document.querySelector(
				`#issue-selector > option[value="${milestoneId}"]`
			).textContent;

			const li = document.createElement("li");

			li.textContent = milestoneName;

			milestoneValuesList.appendChild(li);
		});

		let issueName = document.getElementById("issue-name").value;

		let milestones = getMilestones();

		createIssues(
			milestones,

			issueName,

			priority
		)
			.then(_ => {
				showToast(
					`Issue '${issueName}' créee pour les projets <ul>${milestones
						.map(m => `<li>${m.title}</li>`)
						.join("")}</ul>`
				);
			})
			.catch(error => {
				showToast(
					`Les issues n'ont pas pu être créées : ${error}`,
					"error"
				);

				logToConsole(error);
			});

		// Reset des projets et du nom de l'issue

		resetBtn.click();

		document.getElementById("issue-name").value = "";

		document.querySelector('input[value="priority::low"]').checked = true;
	});
});

/**

* Créer les issues pour chaque milestone

* @param {list} milestones liste des milestones auxquels créer l'issue (id, et nom)

* @param {str} issue  nom de l'issue

* @param {str} priority priorité de l'issue (low, medium, high)

* @returns {bool} false si une erreur s'est produite

*/

async function createIssues(milestones, issue, priority) {
	if (!milestones.length) {
		const msg = "erreur: Pas de milestone auxquels créer l'issue";

		logToConsole(msg);

		throw msg;
	}

	if (!issue) {
		const msg = "erreur: Nom d'issue vide";

		logToConsole(msg);

		throw msg;
	}

	for (let milestone of milestones) {
		await createIssue(milestone, issue, priority);
	}

	return true;
}

/**

* Créer l'issue et l'associe au milestone

* @param {object} milestone metadonné sur le milestone

* @param {str} issue  nom de l'issue

* @param {str} priority priorité de l'issue (low, medium, high)

*/

async function createIssue(milestone, issue, priority) {
	let projectToFind = extractProject(milestone.title);

	if (!projectToFind) projectToFind = Y340_PRJ;

	logToConsole(`Projet Gitlab : ${projectToFind}`);

	let gitlabProject = await searchGitLabProject(projectToFind);

	logToConsole(`Projet trouvé dans gitlab: ${gitlabProject}`);

	// par défaut on met dans QUAL_IHM

	if (!gitlabProject) {
		gitlabProject = Y340_PRJ;
	}

	return await postIssue(gitlabProject, issue, milestone.id, priority);
}

/**

* Recherche le projet gitlab associé à l'issue

* @param {string} projectName

 * @returns

 */

async function searchGitLabProject(projectName) {
	return fetchRepository(projectName)
		.then(projects => {
			let bestMatch = projects.find(p => p.name == projectName);

			logToConsole(
				`✅ Dépôt trouvé: ${bestMatch.name} (ID: ${bestMatch.id})`
			);

			return bestMatch.id;
		})
		.catch(error => {
			logToConsole(`❌ searchGitLabProject Erreur : ${error.message} `);
		});
}

/**

* Génère les boutons pour cloturer une issue

*/

function addCloseIssuesButtons() {
	let deleteButtons = document.querySelectorAll(".close-issue");

	for (var i = 0, len = deleteButtons.length; i < len; i++) {
		deleteButtons[i].addEventListener("click", deleteIssueEvent);
	}
}

/**

* Evenement de cloture d'issue

*/

const deleteIssueEvent = ({ target }) => {
	let iid = target.getAttribute("iid");

	let projectId = target.getAttribute("project");

	closeIssue(projectId, iid);
};

/**

* Cloture l'issue

 * @param {*} projectId projet id ou se trouve l'issue

* @param {*} issueIid iid de l'issue

* @returns

 */

async function closeIssue(projectId, issueIid) {
	logToConsole(`Cloture de l'issue ${issueIid} (project_id: ${projectId})`);

	let confirmed = confirm(`Voulez-vous fermer cette issue ?`);

	if (!confirmed) return;

	await updateIssue(projectId, issueIid)
		.then(response => {
			if (response.ok) {
				let issuesEl = document.getElementById("issue-list");

				let issueEl = issuesEl.querySelector(
					`tr[projectid="${projectId}"][iid="${issueIid}"]`
				);

				let issueCell = issueEl.querySelector(`.issue-cell`);

				issueCell.classList.add("state-closed");

				let btn = issueEl.querySelector(".close-issue");

				btn.classList.remove("state-opened");

				btn.classList.add("state-closed");

				btn.textContent = "Clôturé";

				btn.removeEventListener("click", deleteIssueEvent);

				showToast(`Issue '${issueCell.textContent}' fermée`);
			}
		})
		.catch(error => {
			logToConsole(`closeIssue - Exception levé: ${error}`);
		});
}
