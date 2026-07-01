const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const kudosRoutes = require('./routes/kudos.routes');
const adminRoutes = require('./routes/admin.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const { requestLogger } = require('./middleware/logger.middleware');
const {
	apiRateLimit,
	authRateLimit,
	kudosRateLimit
} = require('./middleware/rate-limit.middleware');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
const allowedOrigins = new Set(
	(process.env.CORS_ORIGIN || '')
		.split(',')
		.map((origin) => origin.trim())
		.filter(Boolean)
);

if (allowedOrigins.size === 0 && process.env.NODE_ENV !== 'production') {
	allowedOrigins.add('http://localhost:5173');
	allowedOrigins.add('http://127.0.0.1:5173');
}

app.use(
	cors({
		origin(origin, callback) {
			if (!origin || allowedOrigins.has(origin)) {
				callback(null, true);
				return;
			}

			callback(new Error('Not allowed by CORS'));
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
	})
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(requestLogger);
app.use('/api', apiRateLimit);
app.use('/uploads', express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads')));

app.get('/health', (req, res) => {
	res.status(200).json({ success: true, message: 'KudosHub API is running' });
});

app.use('/api/auth', authRateLimit, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/kudos', kudosRateLimit, kudosRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
