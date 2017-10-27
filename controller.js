var fs = require('fs');
var ejs = require('ejs');
var querystring = require('querystring');
var db = require('./db');

module.exports = {
    login: function (req, res) {
        var body = '';
        req.on('data', function (data) {
            body += data;
        }).on('end', function () {
            var bodyParse = querystring.parse(body)
            //아이디 검색
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
                        //아이디 일치시 list에 값 출력
                        db.query("SELECT * FROM board", function (err, result, fields) {
                            res.end(ejs.render(data, {
                                prodList: result
                            }));
                        });
                    });

                }
            });
        });
    },
    list: function (req, res) {  //??
        req.on('end', function () {
            fs.readFile('views/list.ejs', 'utf-8', function (err, data) {
                db.query("SELECT * FROM board", function (err, result, fields) {
                    res.end(ejs.render(data, {
                        prodList: result
                    }));
                });
            });
        });
    },
    write: function (req, res) {
        fs.readFile('views/write.ejs', function (err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data + '');
            res.end();
        });
    },
    writeList: function (req, res) {
        var body = '';
        req.on('data', function (data) {
            body += data;
        }).on('end', function () {
            var bodyParse = querystring.parse(body);
            db.query("INSERT INTO board (name, text) VALUES (?, ?)", [bodyParse.name, bodyParse.text], function (err, result, fields) {
                fs.readFile('views/list.ejs', 'utf-8', function (err, data) {
                    db.query("SELECT * FROM board", function (err, result, fields) {
                        res.end(ejs.render(data, {
                            prodList: result
                        }));
                    });
                });
            });
        });
    },
    editList: function (req, res, params) {
        var body = "";
        req.on('data', function (data) {
            body += data;
        }).on('end', function () {
            var bodyParse = querystring.parse(body)
            db.query("UPDATE board SET name = ?, text = ? WHERE id = ?", [bodyParse.name, bodyParse.text, req.params.id], function (err, result, fields) {
                fs.readFile('views/list.ejs', 'utf-8', function (err, data) {
                    db.query("SELECT * FROM board", function (err, result, fields) {
                        res.end(ejs.render(data, {
                            prodList: result
                        }));
                    });
                });
            })
        });
    },
    edit: function (req, res, params) {
        fs.readFile('views/edit.ejs', 'utf-8', function (err, data) {
            db.query("SELECT * FROM board WHERE id = ?", [req.params.id], function (err, result, fields) {
                res.end(ejs.render(data, {
                    product: result
                }));
            });
        });
    },
    delete: function (req, res, params) {
        db.query("DELETE FROM board WHERE id = ?", [req.params.id], function (err, result, fields) {
            if (err) throw err;
            fs.readFile('views/list.ejs', 'utf-8', function (err, data) {
                db.query("SELECT * FROM board", function (err, result, fields) {
                    res.end(ejs.render(data, {
                        prodList: result
                    }));
                });
            });
        });
    }
};