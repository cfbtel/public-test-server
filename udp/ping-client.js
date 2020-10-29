const dgram = require("dgram");
const CronJob = require("cron").CronJob;

const client = dgram.createSocket("udp4");
const HOST = "23.234.197.146";
const PORT = 3030;
const packetSize = 32; // size of each packet in byte
const packetsToSend = 10; // number of packets to send
const message = new Buffer.alloc(packetSize);

const pingArray = [];
let sendTime;
let sentPackets = 0;
let receivedPackets = 0;

client.on("message", (message, remote) => {
	pingArray.push(Date.now() - sendTime);
	receivedPackets += 1;
	console.log(`${Date.now() - sendTime} ms`);
});

const sendPacket = () => {
	if (sentPackets === packetsToSend) {
		calculateResults(pingArray);
		process.exit();
	}
	sendTime = Date.now();
	client.send(message, 0, message.length, PORT, HOST, (err, bytes) => {
		sentPackets += 1;
		if (err) throw err;
	});
};

const calculateResults = (arr) => {
	console.log("__________________________");

	// Ping Result
	console.log("Ping Results:");
	console.log(`Min: ${Math.min(...pingArray)} ms`);
	console.log(`Max: ${Math.max(...pingArray)} ms`);
	const avg = pingArray.reduce((a, b) => a + b, 0) / pingArray.length;
	console.log(`Avg: ${avg.toFixed(2)} ms`);
	console.log(`SD: ${calculateSD(pingArray, avg)}`);
	console.log(" ");

	// Packet loss Calculation
	const packetLoss = 100 - (receivedPackets / sentPackets) * 100;
	console.log(`${sentPackets} packets sent.`);
	console.log(`${receivedPackets} packets received.`);
	console.log(`Packet loss: ${packetLoss.toFixed(2)}%`);
	console.log(" ");

	// Jitter Calculation
	const jArr = [];
	for (i = 0; i < arr.length - 1; i++) {
		jArr.push(Math.abs(arr[i] - arr[i + 1]));
	}
	const jitter = (jArr.reduce((a, b) => a + b, 0) / jArr.length).toFixed(3);
	console.log(`Jitter: ${jitter} ms`);
	console.log("__________________________");
	console.log(" ");
};

const calculateSD = (arr, avg) => {
	let sum = 0;
	for (i = 0; i < arr.length; i++) {
		sum += (arr[i] - avg) * (arr[i] - avg);
	}
	const sd = Math.sqrt(sum / (arr.length - 1));
	return sd.toFixed(2);
};

const job = new CronJob(
	"* * * * * *",
	() => {
		sendPacket();
	},
	null,
	true,
	"America/Los_Angeles"
);
console.log(" ");
console.log(`Sending ${packetSize} byte UDP Packets to ${HOST}:${PORT}`);
job.start();
