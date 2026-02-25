import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

export const checkPassword = async (enteredPassword: string, storePassword: string) => {
  return await bcrypt.compare(enteredPassword, storePassword)
}