module.exports = () => {
	const error = new Error("404 - Route not found.");
	error.statusCode = 404;
	throw error;
};
