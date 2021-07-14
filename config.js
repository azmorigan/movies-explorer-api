require('dotenv').config();

const { JWT_KEY = 'dev_stage' } = process.env;

module.exports = JWT_KEY;
