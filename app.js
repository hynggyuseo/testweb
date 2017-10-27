var http = require('http');
var url = require('url');
var fs = require('fs');
var ejs = require('ejs');
var querystring = require('querystring');
var finalhandler = require('finalhandler')
var Router = require('router');
var router = Router();
var controller = require('./controller');


router.get('/', controller.login);
router.post('/login', controller.login);
router.get('/write', controller.write);
router.post('/writeList', controller.writeList);
router.post('/editList/:id', controller.editList);
router.get('/edit/:id', controller.edit);
router.get('/delete/:id', controller.delete);



http.createServer(function (req, res) {
    // var m = router.match(req.url);
    // if (m) m.fn(req, res, m.params)
    // else res.end('404!');
    router(req, res, finalhandler(req, res))

}).listen(8000);

