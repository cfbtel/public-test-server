const express = require("express");
const fileUpload = require("express-fileupload");

const requireAuth = require("../../middlewares/require-auth");
const deleteHandler = require("../../handlers/delete.handler");

const router = express.Router();

router.post("/", requireAuth, fileUpload({ useTempFiles: true, debug: false }), (req, res) => {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send("No files were uploaded.");
	}
	let file = req.files.file;
	file.mv(`${__dirname}/files/${Date.now()}.${file.name}`, (err) => {
		if (err) {
			return res.status(500).send(err);
		}
		res.json({ error: false, message: "File uploaded." });
		deleteHandler();
	});
});

module.exports = router;
