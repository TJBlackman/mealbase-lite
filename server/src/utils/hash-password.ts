import bcrypt from 'bcrypt';
const saltRounds = 10;

export const createHash = (password: string) =>
  bcrypt.hash(password, saltRounds);

export const compareHash = (plainTextPassword: string, existingHash: string) =>
  bcrypt.compare(plainTextPassword, existingHash);
