import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Access denied. No active token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "aura_lms_super_secret_session_token_key_1994");
    
    // Attach decoded user info
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.warn("Auth Notice: Session token expired. Prompting user re-login.");
    } else {
      console.error("Auth Middleware Error:", error.message);
    }
    res.status(401).json({ message: "Access denied. Invalid or expired token." });
  }
};
