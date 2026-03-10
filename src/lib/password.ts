import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, originalHash] = stored.split(":");
  if (!salt || !originalHash) {
    return false;
  }

  const hash = scryptSync(password, salt, 64);
  const original = Buffer.from(originalHash, "hex");
  return timingSafeEqual(hash, original);
}
