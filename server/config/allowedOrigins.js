const allowedOriginsString = process.env.ALLOWED_ORIGINS;
const allowedOrigins = allowedOriginsString.split(',');

module.exports = allowedOrigins;
