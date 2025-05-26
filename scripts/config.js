class Config {
	constructor() {
		this.debugMode = false;
		this.boardId = 0;
		this.milestoneId = 0;
		this.gitlabToken = "";
		this.tab = "";
	}

	/**
	 * Read configuration from local storage
	 * @returns config object
	 */
	static readConfig() {
		const cfg = JSON.parse(localStorage.getItem(LS_KEY));

		if (!cfg) {
			const config = new Config();
			config.debug = false;
			config.token = "";
			config.tab = "dashboard";
			return config;
		}

		const config = new Config();
		config.debug = cfg.debugMode;
		config.board = cfg.boardId;
		config.milestone = cfg.milestoneId;
		config.token = cfg.gitlabToken;
		config.tab = cfg.tab;
		return config;
	}

	/**
	 * Update configuration in local storage
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

var config = Config.readConfig();
