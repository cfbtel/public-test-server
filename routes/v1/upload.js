const express = require("express");
const multer = require("multer");
const requireAuth = require("../../middlewares/require-auth");
const deleteHandler = require("../../handlers/delete.handler");

const router = express.Router();

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + "-" + file.originalname);
	},
});

const fileFiler = (req, file, cb) => {
	if (file.mimetype === "application/zip") {
		cb(null, true);
	} else {
		const error = new Error("This file is not allowed.");
		error.statusCode = 400;
		cb(error, false);
	}
};

router.post(
	"/",
	requireAuth,
	multer({ storage: fileStorage, fileFilter: fileFiler }).single("file"),
	(req, res) => {
		res.status(200).json({ error: false, message: "Upload finished successfully" });
		deleteHandler();
	}
);

module.exports = router;
