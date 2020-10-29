const fs = require("fs-extra");
const path = require("path");

const dirName = path.resolve(__dirname, "..");

module.exports = async () => {
	try {
		await fs.emptyDir(`${dirName}/uploads`);
		fs.writeFile("./uploads/upload.txt", "", ["utf-8"], () => {});
	} catch (err) {
		console.error(err);
	}
};
