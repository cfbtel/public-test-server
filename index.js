require("dotenv").config(".env");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const downloadRoutes = require("./routes/v1/download");
const uploadRoutes = require("./routes/v1/upload");
const errorHandler = require("./handlers/error.handler");
const notFoundHandler = require("./handlers/not-found.handler");

const app = express();

app.use(helmet());
app.use(cors());
app.options("*", cors());

app.use("/v1/download", downloadRoutes);
app.use("/v1/upload", uploadRoutes);
app.use(
	"/v1/api-docs",
	swaggerUi.serve,
	(req, res, next) => {
		if (req.query.token === process.env.DOCS_TOKEN) {
			next();
		} else {
			const error = new Error("Not Authorized.");
			error.statusCode = 403;
			throw error;
		}
	},
	swaggerUi.setup(swaggerDocument)
);

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

// is it ??
