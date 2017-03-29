var express = require('express');
var router = express.Router();
var userDB = require('../chatRoom/userdb')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendfile("views/chatRoom.html")
});

router.post('/register',function (req, res, next) {
    var back = {}
    userDB.add(req.body.user , req.body.password,function (err, doc) {
        console.log(err,doc)
        if(err && err.code == '11000'){
            back.success = false
            back.msg='用户名已存在，请重新输入用户名'
        }else if(err){
            back.success = false
            back.msg = '未知错误'
        }else{
            back.success = true
            back.msg = '注册成功'
            back.user = doc
        }
        res.send(back)
    })
})

router.post('/login',function (req, res, next) {
    var back = {}
    userDB.find(req.body.user ,function (err, doc) {
        if(!doc){
            back.success = false
            back.msg = '该账号尚未注册，请先去注册'
        }else{
            if(req.body.password != doc.password){
                back.success = false
                back.msg = '登录失败，密码与账户名错误'
            }else{
                back.success = true
                back.msg = '登录成功'
                back.user = doc
            }
        }
        res.send(back)
    })
})

module.exports = router;
