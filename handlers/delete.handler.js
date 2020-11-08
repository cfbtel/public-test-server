const fs = require("fs-extra");
const path = require("path");

const dirName = path.resolve(__dirname, "..", "./routes/v1");

module.exports = async () => {
	try {
		await fs.emptyDir(`${dirName}/files`);
		fs.writeFile(`${dirName}/files/upload.txt`, "", ["utf-8"], () => {});
	} catch (err) {
		console.error(err);
	}
};
