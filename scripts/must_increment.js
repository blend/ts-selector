const path = require('path');

function main() {
	const versionsFilename = path.join(__dirname, '../docs/versions.json');
	const versions = require(versionsFilename);

	const pjsonFilename = path.join(__dirname, '../package.json');
	var pjson = require(pjsonFilename);

	const currentVersion = pjson.version;
	if (versions.includes(currentVersion)) {
		console.error("abort; you must increment the `version` field in ./package.json")
		process.exit(1);
	}
	process.exit(0);
}

if (require.main === module) {
	main();
}