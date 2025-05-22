/**

* Authentification à Gitlab

*/

async function authenticate() {
	try {
		let response = await fetch(`${GITLAB_API}/user`, {
			headers: { "Private-Token": config.token }
		});

		if (!response.ok) {
			throw new Error("Échec de l'authentification à GitLab !");
		}

		let user = await response.json();

		logToConsole(`✅ Connecté en tant que ${user.username}`);

		return true;
	} catch (error) {
		logToConsole(
			`❌ Erreur : ${error.message} - Vérifier dans les paramètres votre token`
		);

		return false;
	}
}
