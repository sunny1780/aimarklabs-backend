const { requestHandler } = require('../server');

module.exports = (req, res) => {
  req.url = '/';
  return requestHandler(req, res);
};
