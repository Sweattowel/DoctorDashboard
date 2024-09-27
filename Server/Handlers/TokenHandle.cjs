require("dotenv").config();

const JWT = require("jsonwebtoken");

const userPrivateKey = process.env.USER_PRIVATE_KEY;
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;

// USER TOKENS
function CreateToken(input) {
    console.log("Creating Token");   

    return JWT.sign(input, userPrivateKey, {expiresIn: "5m"});
};

function VerifyToken(token) {
    console.log("Verifying Token");

    try {
        JWT.verify(token, userPrivateKey, { maxAge: "5m" });
        return true;
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return false;
    }
}

function DecodeToken(token) {
    try {
        console.log("Decoding Token");
        
        const decodedToken = JWT.verify(token, userPrivateKey);

        return decodedToken;
    } catch(error) {
        return "FAIL"
    }
}

function RefreshToken(token, data) {
    console.log("Refreshing Token");

    const decoded = JWT.verify(token, userPrivateKey);

    const currentTime = Math.floor(Date.now() / 1000); 

    if (decoded.exp - currentTime < 900) {
        console.log("Token is close to expiration, creating a new one.");
        return CreateToken(data);
    } else {
        console.log("Token still valid, no need to refresh.");
        return token;
    }
};
// ADMIN TOKENS
function CreateAdminToken(input) {
    console.log("Creating Token");   

    return JWT.sign(input, adminPrivateKey, {expiresIn: "5m"});
};

function VerifyAdminToken(token) {
    console.log("Verifying Admin Token");

    return JWT.verify(token, adminPrivateKey, { maxAge: "5m" });
};

function RefreshAdminToken(token, data) {
    console.log("Refreshing Token");

    const decoded = JWT.verify(token, adminPrivateKey);

    const currentTime = Math.floor(Date.now() / 1000); 

    if (decoded.exp - currentTime < 900) {
        console.log("Token is close to expiration, creating a new one.");
        return CreateToken(data);
    } else {
        console.log("Token still valid, no need to refresh.");
        return token;
    }
};
module.exports = { CreateToken, VerifyToken, DecodeToken, RefreshToken, CreateAdminToken, VerifyAdminToken, RefreshAdminToken };
