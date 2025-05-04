import bcrypt from 'bcrypt';

const passwordPlain = '1234567890'; // password yang kamu mau
const hash = await bcrypt.hash(passwordPlain, 10);
console.log(hash);
