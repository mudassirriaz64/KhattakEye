module.exports = (err, req, res, next) => {
  console.error(err.stack || err);

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Invalid ObjectId CastError
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid resource ID format: ${err.value}`;
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  res.status(statusCode).json({
    message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};
