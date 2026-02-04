import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    const err = new Error("Unauthorized");
    err.status = 401;
    return next(err);
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id };
    next();
  } catch {
    const err = new Error("Invalid token");
    err.status = 401;
    next(err);
  }
}
