//Connection to Postgres goes here

const { Pool } = require('pg');
//connect to PostgreSQL DB: node-postgres.com

//make the connection, using default ENV variables, documented in node-postgres.com
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

module.exports = {  //export a query function that takes two parameters.
  query: (text, params) => pool.query(text, params),  
}

//So now the question is how to use sequelize and first, construct the model then uses that to query the db
