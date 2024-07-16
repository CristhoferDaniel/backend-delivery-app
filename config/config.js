const promise = require("bluebird");
import dotenv from "dotenv";
const option = {
  promiseLib: promise,
  query: (e) => {},
};
const pgp = require("pg-promise")(option);
const types = pgp.pg.types;
types.setTypeParser(1114, function (stringValue) {
  return stringValue;
});

const databaseConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "delivery_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "admin",
};
const db = pgp(databaseConfig);
module.exports = db;
