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
        throw error;  // Let the calling function handle the error
    }
}

async function COMPARE(plainText, hashedPassword) {
    try {
        console.log("Comparing password");
        const isMatch = await bcrypt.compare(plainText, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error("Error comparing password:", error);
        throw error;  // Let the calling function handle the error
    }
}

// Export the functions
module.exports = { HASH, COMPARE };
