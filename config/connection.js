//Node Connection to MySQL

var mysql = require("mysql");

var connection;
const queryString = process.env.CLEARDB_DATABASE_URL || {
  host: "localhost",
  user: "root",
  password: 'P1v-{^|$|]!$"|b',
  database: "burgers_db",
};
function handleDisconnect(conn) {
  conn.on("connect", (e) => console.log("connected"));
  conn.on("error", function (err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== "PROTOCOL_CONNECTION_LOST") {
      throw err;
    }

    console.log("Re-connecting lost connection: " + err.stack);

    connection = mysql.createConnection(queryString);
    handleDisconnect(connection);
    connection.connect();
  });
}
connection = mysql.createConnection(queryString);
handleDisconnect(connection);

// testing a select every 3 seconds :
// to try the code you can stop mysql service => select will fail
// if you start mysql service => connection will restart correctly => select will succeed
setInterval(function () {
  connection.query("select 1", function (err, results) {
    if (err) console.log("SELECT", err.code);
    else console.log("SELECT", results);
  });
}, 3000);
module.exports = connection;
