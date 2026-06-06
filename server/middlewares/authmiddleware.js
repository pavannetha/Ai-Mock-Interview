import jwt from "jsonwebtoken";

export function authmiddleware(req, res, next) {
  //   console.log(req.headers.authorization, " in authmiddleware");
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ message: "token not provided in authmiddleware" });
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "token not provided" });
  }
  try {
    const userPayload = jwt.verify(token, process.env.JWT_SECRETKEY);

    req.user = userPayload;
    next();
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" });
    }
    if (error.name == "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid Token" });
    }
    return res.status(500).json({ message: "internal server error" });
  }
}
