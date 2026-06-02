export const notFound = (req, _res, next) => next({ status: 404, message: `Not found: ${req.originalUrl}` });
export const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message: err.message || 'Server error',
  });
};