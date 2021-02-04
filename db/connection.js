const util = require("util");
const mysql = require("mysql");

// Create connection
const connection = mysql.createConnection({
    // Host for Development
    host: "localhost",
    // Port for Development Database
    port: 3306,
    // Database user-name
    user: "root",
    // Database password
    password: "rootroot",
    // Database Name
    database: "Employees"
});
// Connect to the Database
connection.connect();

// Setting up the connection to use promises instead of callbacks
connection.query = util.promisify(connection.query);

// Exporting the Database Connection
module.exports = connection;