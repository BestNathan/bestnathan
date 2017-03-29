/**
 * Created by nathan on 2017/2/28.
 */
var io = require('socket.io')


var socketServer;
var nicks = []
var gaming = false
var painter
var answer,
    tip

exports = module.exports = function(server) {
    //绑定服务器
    if(server){
        socketServer = io(server)
        socketServer.on("connection", function (socket) {
            var nick
            socket.emit('enter',"hahaha")
            //监听游戏事件
            socket.on('gameStart',function (data) {
                gaming = true
                painter = data
                socket.broadcast.emit('gameStart',data)
            })
            socket.on('answerAndTip',function (data) {
                answer = data.answer
                tip = data.tip
                data.nick = nick
                socket.broadcast.emit('answerAndTip',data)
            })
            socket.on('gameOver',function () {
                gaming = false
                socket.broadcast.emit('gameOver')
            })
            socket.on('gaming',function () {
                console.log(gaming)
                socket.emit('gaming',gaming)
            })
            //监听信息事件
            socket.on('subNick',function (data) {
                if(nicks.indexOf(data) != -1){
                    socket.emit('exist')
                }else{
                    nick = data
                    nicks.push(data)
                    socket.emit('nicked',data)
                    socket.broadcast.emit('newPlayer',data)
                }
            })
            //监听绘画事件
            socket.on('drawBegin',function (data) {
                socket.broadcast.emit('drawBegin',data)
            })
            socket.on('drawing',function (data) {
                socket.broadcast.emit('drawing',data)
            })
            socket.on('drawEnd',function () {
                socket.broadcast.emit('drawEnd')
            })
            socket.on('clearUp',function () {
                socket.broadcast.emit('clearUp')
            })
            socket.on('drawSetting',function (data) {
                socket.broadcast.emit('drawSetting',data)
            })
            socket.on('joinGaming',function (data) {
                socket.broadcast.emit('joinGaming',data)
            })
            socket.on('picData',function (data) {
                socket.broadcast.emit('picData',data)
            })
            //监听猜词事件
            socket.on('guessWrong',function (data) {
                socket.broadcast.emit('guessWrong',data)
            })
            socket.on('guessRight',function (data) {
                socket.broadcast.emit('guessRight',data)
            })
            //断开连接事件
            socket.on("disconnect",function () {
                console.log("%s 是画家",painter)
                if(nick==painter){
                    painter = undefined
                    gaming = false
                    socket.broadcast.emit('gameOver')
                }
                var index = nicks.indexOf(nick)
                nicks.splice(index,1)
                socket.broadcast.emit('leave',nick)
            })
        })
    }
}
