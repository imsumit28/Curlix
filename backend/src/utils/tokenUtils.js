const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;

function generateOwnerToken() {
  return nanoid(32);
}

async function hashToken(rawToken) {
  return bcrypt.hash(rawToken, SALT_ROUNDS);
}

async function verifyToken(rawToken, hash) {
  return bcrypt.compare(rawToken, hash);
}

module.exports = { generateOwnerToken, hashToken, verifyToken };
