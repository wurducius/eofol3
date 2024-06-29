require("dotenv").config();

const defaultEnv = require("../config/default-env");

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  ...defaultEnv,
  ...process.env,
  PORT: randomInteger(3000, 8999),
};
