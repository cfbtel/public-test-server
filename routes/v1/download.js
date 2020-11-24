const express = require("express");
const path = require("path");

const dirName = path.resolve(__dirname, "..", "..");
const router = express.Router();

router.get("/:size", (req, res) => {
	const size = req.params.size;
	const sizeArray = ["5", "10", "20", "1024", "10240"];
	if (sizeArray.includes(size)) {
		res.status(200).download(`${dirName}/dl/${size}MB.zip`);
	} else {
		const error = new Error("File size not allowed.");
		error.statusCode = 400;
		throw error;
	}
});

module.exports = router;
