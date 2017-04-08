/**
 * Created by nathan on 2017/3/15.
 */
//appID wx2d5f55367eee33c4
//appSecret bc5b8b72f21da498d3df275ff62e1ddc
//获取accessToken的Api
//https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx2d5f55367eee33c4&secret=bc5b8b72f21da498d3df275ff62e1ddc
//返回
// {"access_token": "nkY3TMZxP2qdZzOpyP1tN4Q0h2ihANL_ZK379olFrYIiutoB37l9zo5g3qMv1BMk5YJA9AZL86AJi2wZacIGuxrG9KM_89c6JHhoHvRSRC22JFi1VQJNU6SUoV6dDODzFITbACAKNY","expires_in": 7200}
// {
//     "button": [
//     {
//         "type": "view_limited",
//         "name": "H5播放器",
//         "url": "http://mp.weixin.qq.com/s?__biz=MzA3NzM5NzkxMg==&mid=301616417&idx=1&sn=9b299cb7d084e2bdd215ab28e3ecde14&chksm=0b5c47d63c2bcec0b10c8c7f59fb3fa4c80f11b2a553c369fb7735e1d1d2108d36a6d3440a3c&scene=18#wechat_redirect"
//     },
//     {
//         "type": "view_limited",
//         "name": "你画我猜",
//         "url": "http://mp.weixin.qq.com/s?__biz=MzA3NzM5NzkxMg==&mid=301616420&idx=1&sn=4ef23cb55d18199d4f288ca49111b559&chksm=0b5c47d33c2bcec51578d5bf13a39e2f270c319a00a318b151281332476c91ffc027b5e83e5c&scene=18#wechat_redirect"
//     },
//     {
//         "name": "网络通讯",
//         "sub_button": [
//             {
//                 "type": "view_limited",
//                 "name": "H5聊天室",
//                 "url": "http://mp.weixin.qq.com/s?__biz=MzA3NzM5NzkxMg==&mid=301616419&idx=1&sn=02bc4a88bd2c2a2586f78187f30f8f67&chksm=0b5c47d43c2bcec207832673a8655e39dc095625fa0e6f0d6a1b282a5548588a8bd4fe275569&scene=18#wechat_redirect"
//             },
//             {
//                 "type": "view_limited",
//                 "name": "H5留言板",
//                 "url": "http://mp.weixin.qq.com/s?__biz=MzA3NzM5NzkxMg==&mid=301616421&idx=1&sn=7f4e0dae2ae512d2411ae7816c91b738&chksm=0b5c47d23c2bcec4dc570e41a8ad5a559cf6ad8be47b8c603b80e2385c3e7c8af18e3089047b&scene=18#wechat_redirect"
//             }
//         ]
//     }
// ]
//  }


var express = require('express');
var router = express.Router();
var xml2js = require('xml2js')
var builder = new xml2js.Builder({rootName:'xml',cdata:true})

/* GET home page. */
router.get('/', function(req, res, next) {
    var data = req.param('echostr')
    res.send(data)
});
router.get('/MP_verify_IrqItlTzbsqKSXYl.txt', function(req, res, next) {
    res.send('IrqItlTzbsqKSXYl')
});

router.post('/', function(req, res, next) {

    var xml = req.body.xml
    console.log(xml)
    //     <xml>
    //     <ToUserName><![CDATA[toUser]]></ToUserName>
    //     <FromUserName><![CDATA[fromUser]]></FromUserName>
    //     <CreateTime>1348831860</CreateTime>
    //     <MsgType><![CDATA[text]]></MsgType>
    //     <Content><![CDATA[this is a test]]></Content>
    //     <MsgId>1234567890123456</MsgId>
    //     </xml>
    var obj = {}
    obj.ToUserName = xml.fromusername
    obj.FromUserName = xml.tousername
    obj.CreateTime = xml.createtime
    obj.MsgType = 'text'
    obj.Content = xml.content
    var data = builder.buildObject(obj)
    res.send(data)
});


module.exports = router;
