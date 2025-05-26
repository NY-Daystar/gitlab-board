/**
 * Authentify to Gitlab
 */
async function authenticate() {
	try {
		const response = await fetch(`${GITLAB_API}/user`, {
			headers: { "Private-Token": config.token }
		});

		if (!response.ok) {
			throw new Error("Failed to authenticate to gitlab !");
		}

		const user = await response.json();

		logToConsole(`✅ Connected as ${user.username}`);

		return true;
	} catch (error) {
		logToConsole(
			`❌ Error : ${error.message} - Checked parameters and token`
		);

		return false;
	}
}
