const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
(async function updateBitDev() {
	let redSkyFramework = fs.readdirSync('./node_modules/@bit');
	console.log(redSkyFramework);
	function executeCommand(cmd) {
		return new Promise((resolve, reject) => {
			exec(cmd, (error, stdout, stderr) => {
				if (error) {
					// console.log(`error: ${error.message}`);
					reject(error);
				}
				console.error(stderr);
				console.log(stdout);
				resolve();
			});
		});
	}
	try {
		let dependencyList = [];
		for (let framework of redSkyFramework) {
			dependencyList.push(`@bit/${framework}`);
		}
		console.log(`yarn add ${dependencyList.join(' ')} -E`);
		await executeCommand(`yarn add ${dependencyList.join(' ')} -E`);
	} catch (e) {
		console.log(e.message);
	}
})();
