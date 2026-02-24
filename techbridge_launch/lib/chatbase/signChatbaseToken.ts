import jwt from "jsonwebtoken";
import type { SignedInUser } from "@/lib/auth/getSignedInUser";

export function signChatbaseToken(user: SignedInUser, secret: string): string {
  return jwt.sign(
    {
      user_id: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: "1h", algorithm: "HS256" },
  );
}
