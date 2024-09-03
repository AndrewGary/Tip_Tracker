const mariadb = require('mariadb');
require('dotenv').config({path: './.env'})
const os = require('os');

// Function to determine the appropriate IP
const getDatabaseHost = () => {
  const interfaces = os.networkInterfaces();
  
  for (const interfaceName in interfaces) {
    for (const net of interfaces[interfaceName]) {
      if (net.family === 'IPv4' && !net.internal) {
        // Check if the IP is in your LAN range
        if (net.address.startsWith('192.168.') || net.address.startsWith('10.99')) {
          return process.env.DB_HOST_LOCAL; // Replace with your LAN IP for MariaDB
        }
      }
    }
  }

  // If not in LAN, use the public IP
  return process.env.DB_HOST_PUBLIC;
}

const getConnection = async (maxRetries = 3) => {
  let attempts = 0;

  const host = getDatabaseHost();

  while (attempts < maxRetries) {
    try {
      const conn = await mariadb.createConnection({
        host: host,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        permitLocalInfile: true,
      });

      return conn;
    } catch (error) {
      attempts++;
      console.log(`Attempt ${attempts}: Error in getConnection`);
      console.log(error);

      if (attempts >= maxRetries) {
        throw new Error("Max connection attempts exceeded");
      }

      // Optional: Add a delay before retrying
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    }
  }
  
};

const getTodaysOrders = async () => {

  let connection;

  try{
    connection = await getConnection();
    
    const today = new Date().toISOString().split('T')[0];

    const resp = await connection.query(`select * from orders where order_date = '${today}'`);

    console.log('resp: ', resp);

    return resp;
  }catch(error){
    console.log(error)
  }finally{
    if(connection) await connection.end()
  }
}

const getTodaysTotal = async () => {

  let connection;

  try{
    connection = await getConnection();

    const today = new Date().toISOString().split('T')[0];

    const resp = await connection.query(`select sum(tip) as total from orders where order_date = '${today}'`);

    return resp[0].total;
  }catch(error){
    console.log(error)
  }finally{
    if(connection) await connection.end()
  }
}
module.exports = {
  getConnection,
  getTodaysOrders,
  getTodaysTotal
}
// const Database = require('better-sqlite3');
// const path = require('path');

// const dbPath = path.join(process.cwd(), 'database', 'app.db');

// const db = new Database(dbPath, { verbose: console.log });

// // Example function to create a table
// function initializeDatabase() {
//   db.exec(`
//     create table orders ( id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(50), total decimal(15, 2), street_number varchar(15), street varchar(30), city varchar(30), tip_type varchar(30), tip decimal(15, 2))`);
// }

// function query(query) {
//     const statement = db.prepare(query);
    
//     return statement.all();
// }

// // Example function to insert a user
// function insertUser(name, email) {
//   const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
//   stmt.run(name, email);
// }

// // Example function to get all users
// function getUsers() {
//   const stmt = db.prepare('SELECT * FROM users');
//   return stmt.all();
// }

// module.exports = {
//     db,
//     initializeDatabase,
//     query
// }
