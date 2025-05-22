function showToast(message, status) {
	const toast = document.createElement("div");

	toast.className = `toast toast-${status}`;

	toast.innerHTML = message;

	const container = document.getElementById("toast-container");

	container.appendChild(toast);

	// Supprimer le toast après 4 secondes

	setTimeout(() => {
		toast.remove();
	}, 25000);
}
