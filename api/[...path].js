const { requestHandler } = require('../server');

module.exports = (req, res) => {
  const query = { ...(req.query || {}) };
  const pathSegments = Array.isArray(query.path)
    ? query.path
    : query.path
      ? [query.path]
      : [];

  delete query.path;

  const search = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, String(item)));
      return;
    }
    if (value !== undefined) {
      search.append(key, String(value));
    }
  });

  const pathname = `/api/${pathSegments.join('/')}`;
  req.url = search.size > 0 ? `${pathname}?${search.toString()}` : pathname;

  return requestHandler(req, res);
};
