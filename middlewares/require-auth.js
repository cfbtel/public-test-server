module.exports = (req, res, next) => {
	const token = req.get("Authorization");
	if (token === process.env.TOKEN) {
		next();
	} else {
		const error = new Error("Not Authorized.");
		error.statusCode = 403;
		throw error;
	}
};
