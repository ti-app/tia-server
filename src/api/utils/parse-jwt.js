module.exports = (token) => {
  const base64Token = token.split('.')[1];
  const base64 = base64Token.replace('-', '+').replace('_', '/');
  const parsed = Buffer.from(base64, 'base64').toString('utf-8');
  const payload = JSON.parse(parsed);
  return { payload };
};
