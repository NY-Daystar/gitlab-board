/**
 * Display notifier message
 * @param {string} message  message to show
 * @param {string} status status to add background color (success, failed)
 */
function showToast(message, status) {
	const toast = document.createElement("div");
	toast.className = `toast toast-${status}`;
	toast.innerHTML = message;
	const container = document.getElementById("toast-container");
	container.appendChild(toast);

	// Delete toast after 4 seconds
	setTimeout(() => {
		toast.remove();
	}, 4000);
}
