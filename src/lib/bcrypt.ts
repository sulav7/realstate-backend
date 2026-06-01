import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);
    return hashedPassword;
};

export const comparePassword = async (
    password: string,
    hashedPassword: string
) => {
    return await bcrypt.compare(password, hashedPassword);
};