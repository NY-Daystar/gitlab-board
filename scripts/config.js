class Config {
	constructor() {
		this.debugMode;

		this.boardId;

		this.milestoneId;

		this.gitlabToken;

		this.tab;
	}

	/**

     * Lecture depuis le local storage la configuration

     * @returns la configuration de l'application

     */

	static readConfig() {
		const cfg = JSON.parse(localStorage.getItem(LS_KEY));

		if (!cfg) {
			let config = new Config();

			config.debug = false;

			config.token = "";

			config.tab = "dashboard";

			return config;
		}

		let config = new Config();

		config.debug = cfg["debugMode"];

		config.board = cfg["boardId"];

		config.milestone = cfg["milestoneId"];

		config.token = cfg["gitlabToken"];

		config.tab = cfg["tab"];

		return config;
	}

	/**

     * Met à jour la configuration dans le local storage

     */

	update() {
		localStorage.setItem(LS_KEY, JSON.stringify(this));
	}

	get debug() {
		return this.debugMode;
	}

	set debug(value) {
		this.debugMode = value;

		this.update();
	}

	get board() {
		return this.boardId;
	}

	set board(value) {
		this.boardId = value;

		this.update();
	}

	get milestone() {
		return this.milestoneId;
	}

	set milestone(value) {
		this.milestoneId = value;

		this.update();
	}

	get token() {
		return this.gitlabToken;
	}

	set token(value) {
		this.gitlabToken = value;

		this.update();
	}

	get currentTab() {
		return this.tab;
	}

	set currentTab(value) {
		this.tab = value;

		this.update();
	}
}

var config;

var config = Config.readConfig();
