require("dotenv").config(".env");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const downloadRoutes = require("./routes/v1/download");
const uploadRoutes = require("./routes/v1/upload");
const errorHandler = require("./handlers/error.handler");
const notFoundHandler = require("./handlers/not-found.handler");
const requireAuth = require("./middlewares/require-auth");

const app = express();

app.use(helmet());
app.use(cors());
app.options("*", cors());

app.use("/v1/download", downloadRoutes);
app.use("/v1/upload", uploadRoutes);
app.put("/status", requireAuth, (req, res) => {
	res.status(200).json({ error: false, status: "Available" });
});

app.all("*", notFoundHandler);
app.use(errorHandler);

const start = async () => {
	if (!process.env.TOKEN) {
		throw new Error("TOKEN must be defined.");
	}

	const PORT = process.env.PORT || 3939;
	app.listen(PORT, () => {
		console.log(`Server is ready on port ${PORT}`);
	});
};

start();
