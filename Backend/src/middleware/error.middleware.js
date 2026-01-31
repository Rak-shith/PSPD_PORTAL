module.exports = (err, req, res, next) => {
  console.error(err.stack);
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  res.status(500).json({
    message: 'Internal Server Error'
  });
};
