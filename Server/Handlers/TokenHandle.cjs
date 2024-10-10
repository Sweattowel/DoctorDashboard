require("dotenv").config();

const JWT = require("jsonwebtoken");

const userPrivateKey = process.env.USER_PRIVATE_KEY;
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;

// USER TOKENS
function CreateToken(input) {
    console.log("Creating Token");   

    return JWT.sign(input, userPrivateKey, {expiresIn: "20m"});
};

function VerifyToken(token) {
    console.log("Verifying Token");

    try {
        JWT.verify(token, userPrivateKey, { maxAge: "20m" });
        return true;
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return false;
    }
}

function DecodeToken(token) {
    console.log("Decoding User Token");
    try {
        return JWT.verify(token, userPrivateKey);
    } catch (error) {
        console.error("Decoding failed:", error.message);
        return null;
    }
}

function RefreshToken(token, data) {
    console.log("Refreshing User Token");
    try {
        const decoded = JWT.verify(token, userPrivateKey);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp - currentTime < 900) {
            console.log("Token is close to expiration, creating a new one.");
            return CreateToken(data);
        } else {
            console.log("Token still valid, no need to refresh.");
            return token;
        }
    } catch (error) {
        console.error("Failed to refresh token:", error.message);
        return null; 
    }
};
// ADMIN TOKENS
function CreateAdminToken(input) {
    console.log("Creating Token");   

    return JWT.sign(input, adminPrivateKey, {expiresIn: "20m"});
};

function VerifyAdminToken(token) {
    console.log("Verifying Admin Token");
    try {
        JWT.verify(token, adminPrivateKey);
        return true;
    } catch (error) {
        console.error("Admin token verification failed:", error.message);
        return false;
    }
};

function RefreshAdminToken(token, data) {
    console.log("Refreshing Admin Token");
    try {
        const decoded = JWT.verify(token, adminPrivateKey);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp - currentTime < 900) {
            console.log("Admin token is close to expiration, creating a new one.");
            return CreateAdminToken(data);
        } else {
            console.log("Admin token still valid, no need to refresh.");
            return token;
        }
    } catch (error) {
        console.error("Failed to refresh admin token:", error.message);
        return null; 
    }
};

module.exports = { CreateToken, VerifyToken, DecodeToken, RefreshToken, CreateAdminToken, VerifyAdminToken, RefreshAdminToken };
