const JSONResponse = res => (data, status = 200) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.statusCode = status;
  res.end(JSON.stringify(data));
};

module.exports = (req, res) => {
  return JSONResponse(res)({ now: new Date().getTime() });
};
