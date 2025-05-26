/**

* Affiche dans l'interface le message d'erreur ou de succès

* @param {*} message - données à loggé

* @param {*} message - type de log (dir, info, debug, time, timeEnd, table)

*/

function logToConsole(message, type = undefined) {
	let consoleDiv = document.getElementById("consoleLog");

	let entry = document.createElement("div");

	let time = new Date().toLocaleTimeString();

	entry.textContent = `[${time}] - ${message}`;

	if (type != "timeEnd") consoleDiv.appendChild(entry);

	switch (type) {
		case "time":
			console.time(message);

			break;

		case "timeEnd":
			console.timeEnd(message);

			break;

		case "dir":
			console.dir(message);

			break;

		case "table":
			console.table(message);

			break;

		default:
			console.debug(message);
	}
}
