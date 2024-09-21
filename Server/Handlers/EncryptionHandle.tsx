import bcrypt from "bcrypt"

const saltRounds = 10;

export function HASH(plainText : string){
    console.log("hashing");
    const userPassword = plainText;

    const salt = bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) {
            return;
        }
        return salt
    })
    const hashedPassword = bcrypt.hash(userPassword, salt!, (err, hash) => {
        if (err) {
            return;
        }
        return hash
    })

    return hashedPassword;
}

export function DECRYPT(plainText : string, hashedPassword : string){
    console.log("Decrypting");
    const success = bcrypt.compare(plainText, hashedPassword, (err, result ) => {
        if (err) {
            return;
        }
        return result
    })
    return success;
}

