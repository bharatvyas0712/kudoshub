const morgan = require('morgan');

const requestLogger = morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
	skip: (req) => req.originalUrl === '/health'
});

module.exports = {
	requestLogger
};
