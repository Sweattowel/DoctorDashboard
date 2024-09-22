import bcrypt from "bcrypt";

const saltRounds = 10;

export async function HASH(plainText: string) {
    try {
        console.log("Hashing password");
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(plainText, salt);
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;  // Let the calling function handle the error
    }
}

export async function COMPARE(plainText: string, hashedPassword: string) {
    try {
        console.log("Comparing password");
        const isMatch = await bcrypt.compare(plainText, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error("Error comparing password:", error);
        throw error;  // Let the calling function handle the error
    }
}
