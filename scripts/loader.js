/**

* Affiche le loader lors d'un chargement

* @param {int} top décalage depuis le haut de la page du loader

* @param {int} left décalage depuis la droite de la page du loader

*/

function showLoader(top = "50%", left = "50%") {
	const loader = document.getElementById("loader");

	loader.style.top = top;

	loader.style.left = left;

	loader.style.display = "block";
}

/**
  
  * Masque le loader lors d'un chargement
  
  */

function hideLoader() {
	const loader = document.getElementById("loader");

	loader.style.display = "none";
}
