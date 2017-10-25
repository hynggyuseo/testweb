var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "mydb"
});


module.exports = {
    connect : function (cb) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return cb(err);
            }
            cb(null, connection);
        });
    },
    query : function(query, value, cb){
        this.connect(function (err, connection) {
            connection.query(query, value, function (err, result, fields) {
                if (err) {
                    return cb(err);
                }
                cb(null, result);
            });
        })
    }
};
