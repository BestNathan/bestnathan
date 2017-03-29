/**
 * Created by nathan on 2017/2/28.
 */
var io = require('socket.io')
var userDB = require('./userdb')


var socketServer;
var namedUser = 0;
var annoymousUser = 0;
var users=[]

exports = module.exports = function(server) {
    //绑定服务器
    if(server){
        socketServer = io(server)
        socketServer.on("connection", function (socket) {
            /*
            获取当前服务器上所有连接的用户ID
            返回 ID数组
             socketServer.of('/').clients(function (err,socket) {
             console.log(socket)
             })

             给某个房间的所有用户分发事件

             socket.to(room).emit(event,fn)


             * */

            annoymousUser++
            var nick
            socket.on('login',function () {
                socket.broadcast.emit('enter',{
                    named:namedUser,
                    annoymous:annoymousUser
                })
                socket.emit('enter',{
                    named:namedUser,
                    annoymous:annoymousUser
                })
            })

            socket.on("submitInfo",function (data) {
                // annoymousUser--
                // namedUser++
                // if(users.indexOf(data)==-1){
                //     nick = data
                //     users.push(nick)
                //     socket.emit('nicked',data)
                //     socket.broadcast.emit('user',data)
                // }else{
                //     socket.emit('exist')
                // }
                nick = data.nickname
                userDB.find(data.user,function (err, doc) {
                    if(!doc.nickname){
                        doc.nickname = data.nickname
                        doc.save(function (err , doc) {
                            socket.emit('nicked',data.nickname)
                            socket.broadcast.emit('user',data.nickname)
                            annoymousUser--
                            namedUser++
                        })
                    }else{
                        socket.emit('nicked',data.nickname)
                        socket.broadcast.emit('user',data.nickname)
                        annoymousUser--
                        namedUser++
                    }
                })
            })

            socket.on("message",function (data) {
                socket.broadcast.emit('message',{
                    user:nick,
                    message:data
                })
            })
            //房间相关事件

            socket.on("join",function (data) {
                if(socket.rooms[data])return
                socket.join(data)
                console.log(data,socket.rooms)
                socket.emit("joined",data)
                socket.to(data).emit("joinRoom",{
                    user:nick,
                    room:data
                })
            })

            socket.on("leave",function (data) {
                socket.leave(data)
                socket.to(data).emit("leaveRoom",{
                    user:nick,
                    room:data
                })
            })

            socket.on("roomMessage",function (data) {
                socket.to(data.room).emit("roomMessage",{
                    user:nick,
                    room:data.room,
                    message:data.message
                })
            })

            //断开连接事件

            socket.on("disconnect",function () {
                socket.broadcast.emit('leave',nick)
                var index = users.indexOf(nick)
                users.splice(index)
                nick?
                    namedUser--:
                    annoymousUser--
            })
        })
    }
}
