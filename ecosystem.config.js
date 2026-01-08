// if you will edit this file , then run this command after
// pm2 restart ecosystem.config.js

module.exports = {
	apps: [
		{
			name: "my-protector",
			script: "app.js",
			watch: false,
			ignore_watch: [
				"node_modules",
				"logs",
				"uploads",
				".git",
				"temp",
				"tmp",
				"dist",
				"build",
				"coverage",
			],
		},
	],
};
