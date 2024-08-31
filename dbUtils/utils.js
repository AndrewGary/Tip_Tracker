const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'database', 'app.db');

const db = new Database(dbPath, { verbose: console.log });

// Example function to create a table
function initializeDatabase() {
  db.exec(`
    create table orders ( id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(50), total decimal(15, 2), street_number varchar(15), street varchar(30), city varchar(30), tip_type varchar(30), tip decimal(15, 2))`);
}

function query(query) {
    const statement = db.prepare(query);
    
    return statement.all();
}

// Example function to insert a user
function insertUser(name, email) {
  const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  stmt.run(name, email);
}

// Example function to get all users
function getUsers() {
  const stmt = db.prepare('SELECT * FROM users');
  return stmt.all();
}

module.exports = {
    db,
    initializeDatabase,
    query
}
