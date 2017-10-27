var Router = require('router');
var router = Router();
var controller = require('../controller');

module.exports = function (http) {
    router.get('/', controller.login);
    router.post('/login', controller.login);
    router.get('/write', controller.write);
    router.post('/writeList', controller.writeList);
    router.post('/editList/:id', controller.editList);
    router.get('/edit/:id', controller.edit);
    router.get('/delete/:id', controller.delete);
}
