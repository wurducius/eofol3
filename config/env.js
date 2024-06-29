require("dotenv").config();

const defaultEnv = require("../config/default-env");

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getPort() {
  if (process.env.PORT === "random") {
    return randomInteger(3000, 8999);
  } else if (
    !process.env.PORT ||
    Number.isNaN(process.env.PORT) ||
    !Number.isFinite(process.env.PORT) ||
    !Number.isInteger(process.env.PORT)
  ) {
    return process.env.PORT;
  } else {
    return defaultEnv.PORT;
  }
}

module.exports = {
  ...defaultEnv,
  ...process.env,
  PORT: getPort(),
};
