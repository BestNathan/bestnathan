/**
 * Created by nathan on 2017/3/2.
 */
function socketEvent(socket) {
    //公共消息
    socket.on("enter",function (data) {
        addMessage({
            name:"管理员",
            message:"有一位神秘人物进入了聊天室，当前神秘人物有"+data.annoymous+"位，注册成员有"+data.named+"位"
        },"info","mainRoom")
    })

    socket.on("leave",function (data) {
        var mes
        data?
            mes=data + "离开了聊天室":
            mes="有一位神秘人物离开了聊天室"
        addMessage({
            name:"管理员",
            message:mes
        },"info","mainRoom")
    })

    socket.on("user",function (data) {
        addMessage({
            name:"管理员",
            message:"掌声欢迎，我们迎来了一位注册成员，他就是——"+data
        },"info","mainRoom")
    })

    socket.on("message",function (data) {
        console.log(data)
        addMessage({
            name:data.user,
            message:data.message
        },"primary","mainRoom")
    })

    //room相关事件
    socket.on("joined",function (data) {
        createRoomList(data,null,function () {
            socket.emit('leave',data)
        })
        $('#'+data).click()
    })

    socket.on("joinRoom",function (data) {
        addMessage({
            name:"管理员",
            message:data .user + "加入了房间"
        },"info",data.room)
    })

    socket.on("leaveRoom",function (data) {
        addMessage({
            name:"管理员",
            message:data .user + "离开了房间"
        },"info",data.room)
    })

    socket.on("roomMessage",function (data) {
        addMessage({
            name:data.user,
            message:data.message
        },"primary",data.room)
    })

    socket.on("exist",function (data) {
        console.log(data)
        addMessage({
            name:"管理员",
            message:"昵称已存在，请更换一个新的昵称"
        },"warning","mainRoom")
    })

    socket.on("nicked",function (data) {
        //设置好昵称之后的逻辑
        nick = data
        infoEle.hide()
        messageEle.show()
        $('.xs-showName').html(data+'&nbsp;')
        $(document).keydown(function (event) {
            if(event.keyCode == 13){
                var srcEleClass = $(event.srcElement).attr('class')
                event.preventDefault()
                console.log(srcEleClass)
                if(srcEleClass && srcEleClass.indexOf('message')!=-1)$('.sendMessage').click()
                if(srcEleClass && srcEleClass.indexOf('roomId')!=-1)$('.joinRoom').click()
            }
        })

        addMessage({
            name:"管理员",
            message:"欢迎你，"+data +"，在此你可以畅所欲言"
        },"warning","mainRoom")
    })
}