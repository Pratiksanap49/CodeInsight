export function authenticate(req, res, next) {
  req.user = { id: "000000000000000000000000" }; // temp user
  next();
}
