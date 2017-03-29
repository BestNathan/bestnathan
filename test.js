/**
 * Created by nathan on 2017/2/28.
 */
var io = require('socket.io')
var socket

module.exports = function (server) {
    //绑定服务器
    if(server){
        socket = io(server)
        socket.on("connection",function (socket) {
            console.log("someone come into the chatRoom")
            socket.on("disconnect",function () {
                console.log("someone left the chatRoom")
            })
        })
    }

}