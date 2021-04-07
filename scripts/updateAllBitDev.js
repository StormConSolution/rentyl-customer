const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

(async function updateBitDev() {
	let redSkyFramework = fs.readdirSync('../node_modules/@bit');
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
		for (let i = 0; i < redSkyFramework.length; i++) {
			console.log(`####### BIT INSTALL ${i + 1} of ${redSkyFramework.length} ######`);
			console.log(` ####### INSTALLING @bit/${redSkyFramework[i]} ######`);
			await executeCommand(`yarn add @bit/${redSkyFramework[i]}`);
		}
	} catch (e) {
		console.log(e.message);
	}
})();
