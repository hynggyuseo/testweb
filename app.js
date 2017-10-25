var http = require('http');
var url = require('url');
var fs = require('fs');
var ejs = require('ejs');
var querystring = require('querystring');
var user = require('./user');
var db = require('./db');

var test = function (location) {

}


http.createServer(function (req, res) {
    if (req.url == "/login") {
        var body = '';
        req.on('data', function (data) {
            body += data;
        }).on('end', function () {
            var bodyParse = querystring.parse(body)
            db.query("SELECT * FROM user WHERE name = ?", [bodyParse.username], function (err, result, fields) {
                if (err) throw err;
                if (result.length == 0 || result[0].password != bodyParse.password) {
                    fs.readFile('views/index.ejs', function (err, data) {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.write(data + '');
                        res.end();
                    });
                } else {
                    fs.readFile('views/list.ejs', 'utf-8', function (err, data) {
                        db.query("SELECT * FROM board", function (err, result, fields) {
                            res.end(ejs.render(data, {
                                prodList: result
                            }));
                        });
                    });

                }
            });
        });
    } else if (req.url == "/write") {
        fs.readFile('views/write.ejs', function (err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data + '');
            res.end();
        });
    } else if (req.url.split("/")[1] == "delete") {
        var id = req.url.split("/")[2];
        db.query("DELETE FROM board WHERE id = ?", [id], function (err, result, fields) {
            if (err) throw err;
            fs.readFile('views/list.ejs', 'utf-8', function (err, data) {
                db.query("SELECT * FROM board", function (err, result, fields) {
                    res.end(ejs.render(data, {
                        prodList: result
                    }));
                });
            });
        });
    } else if (req.url.split("/")[1] == "edit") {
        var body = '';
        var id = req.url.split("/")[2];
        fs.readFile('views/edit.ejs', 'utf-8', function (err, data) {
            db.query("SELECT * FROM board WHERE id = ?", [id], function (err, result, fields) {
                res.end(ejs.render(data, {
                    product: result
                }));
            });
        });
    } else if (req.url == "/writeList") {
        var body = '';
        req.on('data', function (data) {
            body += data;
        }).on('end', function () {
            var bodyParse = querystring.parse(body);
            db.query("INSERT INTO board (name, text) VALUES (?, ?)", [bodyParse.name, bodyParse.text], function (err, result, fields) {
                fs.readFile('views/list.ejs', 'utf-8', function (err, data) {
                    db.query("SELECT * FROM board", function (err, result, fields) {
                        check = 10;
                        res.end(ejs.render(data, {
                            prodList: result
                        }));
                    });
                });
            });

        });
    } else if (req.url.split("/")[1] == "editList") {
        var body = "";
        var id = req.url.split("/")[2];
        req.on('data', function (data) {
            body += data;
        }).on('end', function () {
            var bodyParse = querystring.parse(body)
            db.query("UPDATE board SET name = ?, text = ? WHERE id = ?", [bodyParse.name, bodyParse.text, id], function (err, result, fields) {
                fs.readFile('views/list.ejs', 'utf-8', function (err, data) {
                    db.query("SELECT * FROM board", function (err, result, fields) {
                        res.end(ejs.render(data, {
                            prodList: result
                        }));
                    });
                });
            })
        });
    } else if (req.url == "/list") {
        req.on('end', function (data) {
            fs.readFile('views/list.ejs', 'utf-8', function (err, data) {
                db.query("SELECT * FROM board", function (err, result, fields) {
                    res.end(ejs.render(data, {
                        prodList: result
                    }));
                });
            });
        });
    } else {
        fs.readFile('views/index.ejs', function (err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data + '');
            res.end();
        });

    }
}).listen(8000);

