function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV !== 'production') console.error(err);

  if (err.code === '23505') {
    return res.status(409).json({ error: 'This alias is already taken' });
  }

  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : 'Internal server error';
  res.status(status).json({ error: message });
}

module.exports = { errorHandler };
