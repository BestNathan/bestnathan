/**
 * Created by nathan on 2017/3/10.
 */
(function () {
    var socket = io()
    window.mySocket = socket
    socket.on('drawBegin',function (data) {
        if(!nick)return
        var obj = mycanvas.toMyCanvasXY(data)
        mycanvas.drawBegin(obj.x,obj.y)
    })
    socket.on('drawing',function (data) {
        if(!nick)return
        var obj = mycanvas.toMyCanvasXY(data)
        mycanvas.drawing(obj.x,obj.y)
    })
    socket.on('drawEnd',function () {
        if(!nick)return
        mycanvas.drawEnd()
    })
    socket.on('clearUp',function () {
        if(!nick)return
        mycanvas.clearUp()
    })
    socket.on('drawSetting',function (data) {
        if(!nick)return
        mycanvas.setListenWH(data)
        mycanvas.setColor(data.strokeStyle)
        mycanvas.setLineWidth(mycanvas.toMyCanvasLineWidth(data.lineWidth))
    })
    socket.on('joinGaming',function (data) {
        if(!nick)return
        if(painter){
            socket.emit('picData',mycanvas.getPicData())
            var obj = {}
            obj.answer = picAnswer
            obj.tip = picTip
            mySocket.emit('answerAndTip',obj)
        }
    })
    socket.on('picData',function (data) {
        if(!nick)return
        if(newPlayer){
            mycanvas.setPicData(data)
            newPlayer = false
        }
    })
    socket.on('leave',function (data) {
        window.addMessage(data+'离开了游戏','游戏管理员')
    })

})()