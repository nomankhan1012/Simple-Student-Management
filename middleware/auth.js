import jwt from "jsonwebtoken";
// Middleware to authenticate using JWT token
const authenticate = async (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1]);

  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized access. No token provided." });
  }

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ error: "Invalid token. Authentication failed." });
  }
};

// Middleware for admin authorization
const authorizeAdmin = (req, res, next) => {
  if (req.user?.is_admin) {
    next();
  } else {
    return res.status(403).json({ error: "Unauthorized access" });
  }
};

export { authenticate, authorizeAdmin };
