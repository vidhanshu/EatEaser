import jwt from "jsonwebtoken";
import { config } from "../../configs";

type Payload = { _id: string };
export function generateToken(payload: Payload, expiresIn = config.jwt.expire) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: expiresIn,
  });
}

export function verifyJWT(token: string): Payload {
  return jwt.verify(token, config.jwt.secret) as Payload;
}

export const isValidJWT = (token: string) => {
  try {
    verifyJWT(token);
    return true;
  } catch (error) {
    return false;
  }
};
