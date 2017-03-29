/**
 * Created by nathan on 2017/3/9.
 */
var express = require('express');
var router = express.Router();
var userDB = require('../leaveMessages/userdb')
var messagesDB = require('../leaveMessages/messagesdb')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendfile("views/leaveMessages.html")
});

router.post('/register' , function (req, res ,next) {
    var back = {}
    userDB.add(req.body.user , req.body.password , function (err, doc) {
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

router.post('/messages',function (req, res, next) {
    var back = {}
    var options = req.body
    messagesDB.find(options ,function (err, doc) {
        if(!doc){
            back.success = false
            back.msg = '获取失败'
        }else{
            back.success = true
            back.msg = '获取成功'
            back.messages = doc
        }
        res.send(back)
    })
})

router.post('/create',function (req, res, next) {
    var back = {}
    var options = req.body
    messagesDB.add(options ,function (err, doc) {
        if(!doc || err){
            back.success = false
            back.msg = '留言失败'
        }else{
            back.success = true
            back.msg = '留言成功'
            back.messages = doc
        }
        res.send(back)
    })
})
module.exports = router;
