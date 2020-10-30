require("dotenv").config(".env");
const dgram = require("dgram");

const server = dgram.createSocket("udp4");
const port = process.env.UDP_PORT;

server.on("message", (msg, rinfo) => {
	server.send(msg, 0, msg.length, rinfo.port, rinfo.address);
});

server.bind(port, () => {
	console.log(`Listening for UDP Packets on port ${port}`);
});
