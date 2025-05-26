/**
 * Display interface error or succes message
 * @param {string} message - data to log
 * @param {string} type - type of log (dir, info, debug, time, timeEnd, table)
 */
function logToConsole(message, type = undefined) {
	const consoleDiv = document.getElementById("consoleLog");
	const entry = document.createElement("div");
	const time = new Date().toLocaleTimeString();
	entry.textContent = `[${time}] - ${message}`;

	if (type !== "timeEnd") consoleDiv.appendChild(entry);

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
