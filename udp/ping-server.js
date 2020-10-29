require("dotenv").config(".env");
const dgram = require("dgram");

const server = dgram.createSocket("udp4");
const host = process.env.ADDR;
const port = process.env.UDP_PORT;

let count = 0;

server.on("message", (msg, rinfo) => {
	server.send(msg, 0, msg.length, rinfo.port, rinfo.address);
	console.log(count++ + " <--> " + rinfo.address + ":" + rinfo.port);
});

server.bind(port, host, () => {
	console.log(`Listening for UDP Packets on ${host}:${port}`);
});
