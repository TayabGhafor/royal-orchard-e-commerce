function errorMiddleware(err, req, res, _next) {
  const status = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const code = err.code || (status === 500 ? "internal_error" : "request_error");
  const message = err.message || "Internal server error";

  if (status >= 500) {
    // Avoid leaking internals; log server-side only
    // eslint-disable-next-line no-console
    console.error("Unhandled error:", err);
  }

  res.status(status).json({ error: { code, message } });
}

module.exports = { errorMiddleware };

