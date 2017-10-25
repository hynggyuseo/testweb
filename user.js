var userInfo = {
    name : "",
    password : "",
}

var user = module.exports = {

    set : function (name, password) {
        userInfo.name = name;
        userInfo.password = password;
    },
    get : function () {
        return userInfo
    }
}
