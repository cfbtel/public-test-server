require("dotenv").config(".env");
// const http = require("http");
const https = require("https");
const fs = require("fs-extra");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const noCache = require("nocache");

const downloadRoutes = require("./routes/v1/download");
const uploadRoutes = require("./routes/v1/upload");
const errorHandler = require("./handlers/error.handler");
const notFoundHandler = require("./handlers/not-found.handler");
const requireAuth = require("./middlewares/require-auth");
const httpsRedirect = require("./handlers/https.handler");

const app = express();

app.use(httpsRedirect);
app.use(helmet());
app.use(cors());
app.options("*", cors());
app.use(noCache());

app.use("/v1/download", downloadRoutes);
app.use("/v1/upload", uploadRoutes);

app.get("/status", requireAuth, (req, res) => {
	res.status(200).json({ error: false, status: "Available" });
});

app.all("*", notFoundHandler);
app.use(errorHandler);

// const httpServer = http.createServer(app);

// const port = process.env.PORT || 8080;
// httpServer.listen(port, () => {
// 	console.log(`Server is ready on port ${port}`);
// });

const httpsServer = https.createServer(
	{
		key: fs.readFileSync(`${__dirname}/ssl/trymyspeed.key`),
		cert: fs.readFileSync(`${__dirname}/ssl/trymyspeed.crt`),
	},
	app
);

const sslPort = process.env.PORT || 8081;
httpsServer.listen(sslPort, () => {
	console.log(`SSL Server is ready on port ${sslPort}`);
});

const socketIo = require("socket.io");

const io = socketIo(httpsServer, {
	cors: true,
	origins: ["https://client.trymyspeed.com"],
});

io.on("connection", (socket) => {
	console.log("nw cnnnnnnn");
	socket.on("msg", (msg) => {
		socket.emit("msg", msg);
	});
	socket.on("disconnect", () => {
		socket.disconnect();
	});
});
