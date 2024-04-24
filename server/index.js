// imports here for express and pg
const express = require("express");
const app = express();
const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_hr_db"
);
// static routes here (you only need these for deployment)

// app routes here
app.get("/api/employees", async (req, res, next) => {
  try {
    const SQL = `SELECT * from employees;`;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});
// create your init function
const init = async () => {
  await client.connect();
  const SQL = /* sql */ `
  DROP TABLE IF EXISTS employees;
  CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_admin BOOLEAN DEFAULT FALSE 
  );
  INSERT INTO employees(name, is_admin) VALUES('Wendy Sitti', true);
  INSERT INTO employees(name, is_admin) VALUES('Mitchel Mig', true);
  INSERT INTO employees(name, is_admin) VALUES('Chlo Shock', false);
  INSERT INTO employees(name, is_admin) VALUES('Luke Aron', true);
  INSERT INTO employees(name, is_admin) VALUES('Scooter Quint', false);
  `;
  await client.query(SQL);
  console.log("data seeded");

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};
// init function invocation
init();
