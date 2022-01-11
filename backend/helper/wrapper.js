const response = (res, type, result, message = '', code) => {
  let status = true;
  let data = result;
  if (type === 'fail') {
    status = false;
    data = data || '';
    message = message;
  }
  res.send(code, {
    success: status,
    data,
    message,
    code,
  });
};

const logged = (res, type, result, token, message = '', code) => {
  let status = true;
  let data = result;
  if (type === 'fail') {
    status = false;
    data = data || '';
    message = message;
  }
  res.send(code, {
    logged: status,
    data,
    token,
    message,
    code,
  });
};

module.exports = {
  response,
  logged
}