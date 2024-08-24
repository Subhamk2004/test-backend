import bcrypt from 'bcrypt';

const saltRounds = 10;
// This line sets the number of salt rounds to 10.
// Salt rounds determine the computational cost of generating a hash, making it more resistant to brute-force attacks

export const hashPassword = (password) => {
    let salt = bcrypt.genSaltSync(saltRounds);
    console.log(salt);
    return bcrypt.hashSync(password, salt);
}

export const comparePassword = (plain, hashed) => {
    return bcrypt.compareSync(plain,hashed);
}