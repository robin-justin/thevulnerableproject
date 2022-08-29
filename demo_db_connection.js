var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: 'nodelogin',
  password: ""
});

con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM accounts", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });