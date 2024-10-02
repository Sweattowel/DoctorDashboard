const bcrypt = require("bcrypt");

const saltRounds = 10;

async function HASH(plainText) {
    try {
        console.log("Hashing password");
        const salt = await bcrypt.genSalt(saltRounds);
        console.log("Salt generated");
        const hashedPassword = await bcrypt.hash(plainText, salt);
        console.log("Hash generated");
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;  
    }
}

async function COMPARE(plainText, hashedPassword) {
    try {
        console.log("Plaintext password:", plainText);
        console.log("Hashed password:", hashedPassword);

        if (!plainText || !hashedPassword) {
            console.error("Missing data for password comparison");
            return false;
        }

        console.log("Comparing password");
        const isMatch = await bcrypt.compare(plainText, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error("Error comparing password:", error);
        throw error;
    }
}

module.exports = { HASH, COMPARE };
