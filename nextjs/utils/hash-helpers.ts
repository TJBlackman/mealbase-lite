import bcrypt from "bcrypt";
const saltRounds = Number(process.env.HASH_ROUNDS);

export function createHash(password: string) {
  return bcrypt.hash(password, saltRounds);
}

export function compareHash(plainTextPassword: string, existingHash: string) {
  return bcrypt.compare(plainTextPassword, existingHash);
}
