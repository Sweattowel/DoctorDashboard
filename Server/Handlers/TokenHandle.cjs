require("dotenv").config();

const JWT = require("jsonwebtoken");

const privateKey = process.env.PRIVATE_KEY;

function CreateToken(input) {
    console.log("Creating Token");   

    return JWT.sign(input, privateKey, {expiresIn: "5m"});
};

function VerifyToken(token) {
    console.log("Verifying Token");

    return JWT.verify(token, privateKey, { maxAge: "5m" });
};

function RefreshToken(token, data) {
    console.log("Refreshing Token");

    const decoded = JWT.verify(token, privateKey);

    const currentTime = Math.floor(Date.now() / 1000); 

    if (decoded.exp - currentTime < 900) {
        console.log("Token is close to expiration, creating a new one.");
        return CreateToken(data);
    } else {
        console.log("Token still valid, no need to refresh.");
        return token;
    }
};

module.exports = { CreateToken, VerifyToken, RefreshToken };
