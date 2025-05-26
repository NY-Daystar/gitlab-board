/**
 * Display loader when loading data is in progress
 * @param {int} top offset from top of page
 * @param {int} left offset from left of page
 */
function showLoader(top = "50%", left = "50%") {
	const loader = document.getElementById("loader");
	loader.style.top = top;
	loader.style.left = left;
	loader.style.display = "block";
}

/**
 * Hide loader when loading data is done
 */

function hideLoader() {
	const loader = document.getElementById("loader");
	loader.style.display = "none";
}
