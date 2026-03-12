const { requestHandler } = require('../server');

module.exports = (req, res) => {
  req.url = '/health';
  return requestHandler(req, res);
};
