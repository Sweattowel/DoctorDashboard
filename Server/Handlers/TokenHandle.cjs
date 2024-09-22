require("dotenv").config();

const JWT = require("jsonwebtoken");

const privateKey = process.env.PRIVATE_KEY;

function CreateToken(input) {
    console.log("Creating Token");   

    return JWT.sign(input, privateKey, {expiresIn: "2m"});
};

function VerifyToken(token) {
    console.log("Verifying Token");

    return JWT.verify(token, privateKey, {maxAge: "2m", });
};

module.exports = { CreateToken, VerifyToken };
