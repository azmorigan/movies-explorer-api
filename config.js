require('dotenv').config();

const {
  PORT = 3000,
  JWT_KEY = 'dev_stage',
  MONGO_WAY = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;

module.exports = { JWT_KEY, MONGO_WAY, PORT };
