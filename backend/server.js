require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
	console.log(`KudosHub backend listening on port ${PORT}`);
});

process.on('unhandledRejection', (error) => {
	console.error('Unhandled promise rejection', error);
});

process.on('uncaughtException', (error) => {
	console.error('Uncaught exception', error);
	server.close(() => {
		process.exit(1);
	});
});
