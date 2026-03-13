const { requestHandler } = require('../../server');

module.exports = (req, res) => {
  const query = new URLSearchParams();

  Object.entries(req.query || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, String(item)));
      return;
    }
    if (value !== undefined) {
      query.append(key, String(value));
    }
  });

  req.url = query.size > 0
    ? `/api/facebook-ads/overview?${query.toString()}`
    : '/api/facebook-ads/overview';

  return requestHandler(req, res);
};
