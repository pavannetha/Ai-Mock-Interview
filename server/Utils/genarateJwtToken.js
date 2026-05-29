import jwt from "jsonwebtoken";

export function genarateJwtToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRETKEY, {
    expiresIn: "7d",
  });
  return token;
}
