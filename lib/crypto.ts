// lib/crypto.ts
import { randomBytes, createHash } from "crypto";
import { hash as argonHash } from "@node-rs/argon2";
import * as argon2 from "argon2";


export async function hashPassword(password: string) {
  return argonHash(password, {
    algorithm: 2, // argon2id
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

export function generateRawToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}

export function sha256Hex(input: string) {
  return createHash("sha256").update(input).digest("hex");
}
