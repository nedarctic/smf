import { randomBytes } from "crypto";

export function generateIncidentNumber() {
  const random = randomBytes(4).toString("base64url").toUpperCase();
  return `INC-${random}`;
}

export function generateSecretCode() {
  return randomBytes(6).toString("base64url").toUpperCase();
}