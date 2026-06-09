import jwt from "jsonwebtoken";
import { Types } from "mongoose";

// Only the user's MongoDB id is embedded in the token.
// Keeping the payload minimal reduces exposure if the token is decoded client-side.
type UserPayload = {
  id: Types.ObjectId;
};

// Signs and returns a JWT that expires in 6 minutes.
// The authenticate middleware verifies this token on every protected request.
export const generateJWT = (payload: UserPayload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "6m",
  });
  return token;
};
