/**
 * Created by nathan on 2017/3/2.
 */
$(function () {




    //初始化
    var fullScreen = $('.fullScreen')
    if(mdevice)fullScreen.hide()

    messageEle.hide()
    var mainPage = $('.chatRoom .row')
    if(!rooms['mainPage'])rooms['mainPage'] = mainPage
    createRoomList('mainPage',$('.publicRoom'))
    createRoomList('mainRoom',$('.publicRoom'))

    //chatRoom.css("height",document.body.scrollHeight-140 +'px')
    //socket`相关方法

    var socket = io();
    socketEvent(socket,this)

    //表单提交
    $('.submitInfo').on('click',function () {
        if(!nick){
            var ele = $('.nickname')
            var name = ele.val();
            if(!name){
                addMessage({
                    name:"管理员",
                    message:"请填写昵称"
                },"warning")
                return
            }
            socket.emit("submitInfo",{
                nickname : name,
                user : userName
            });
            ele.val('')
        }else{
            addMessage({
                name:"管理员",
                message:"您已经设置好昵称了，目前不可更改，如需更改可以刷新页面"
            },"warning")
        }
    })
    $('.sendMessage').on('click',function () {
        if(currentRoom == 'mainPage')$('#mainRoom').click()
        if(!nick){
            addMessage({
                name:"管理员",
                message:"请先设置昵称，再开始聊天"
            },"warning")
            return
        }
        var ele = $('.message')
        var message = ele.val();
        if(!message){
            addMessage({
                name:"管理员",
                message:"请输入聊天内容"
            },"warning")
            return
        }
        if(chatRoom.hasClass('hidden-xs')){
            $('#'+currentRoom).click()
        }
        addMessage({
            name:"我（" + nick  + "）",
            message:message
        },"success")
        currentRoom == 'mainRoom'?
            socket.emit("message",message):
            socket.emit("roomMessage",{
                room:currentRoom,
                message:message
            })
        ele.val('')
        if(mdevice)ele.blur()
    })
    //事件绑定

    // $('.panel .close').on('click',function () {
    //     $(this).parent().parent().remove()
    // })

    messageEle.find('.clear').on('click',function () {
        $('.chatRoom .row').children().remove()
    })

    navToggle.on('click',function () {
        navbarToggle?
            navbarCollapse.addClass("collapse"):
            navbarCollapse.removeClass("collapse")
        navbarToggle = !navbarToggle
        var height = $('.navbar').height() + 20;
        topBlock.height(height)
    })

    annoymous.on('click',function () {
        annoymousToggle?
            annoymous.removeClass("active"):
            annoymous.addClass("active")
        annoymousToggle = !annoymousToggle
    })

    $('.joinRoom').on("click",function (event) {
        event.preventDefault()
        if(currentRoom == 'mainPage')$('#mainRoom').click()
        if(!nick){
            addMessage({
                name:"管理员",
                message:"请先设置昵称，再开始聊天"
            },"warning")
            return
        }
        var ele = $('.roomId')
        var room = ele.val().trim()

        if(!room){
            addMessage({
                name:"管理员",
                message:"请填写您想要加入的房间名，不能为空"
            },"warning")
            ele.val('')
            return
        }

        if(rooms[room]){
            addMessage({
                name:"管理员",
                message:"您已经加入过"+ room +"房间了，如果您想对此房间发送消息，请在左侧选择相应的房间"
            },"warning")
            return
        }
        socket.emit("join",room)
        if(navbarToggle)navToggle.click()
        ele.val('')
    })

    fullScreen.on('click',function (event) {
        event.preventDefault()
        requestFullScreen()
    })

    back.on('click',function () {
        roomList.removeClass('hidden-xs')
        chatRoom.addClass('hidden-xs')
        back.addClass('hidden-xs')
        //back.removeClass('visible-xs')
    })

    //登录界面 按钮事件绑定
    registerbtn.on('click',function (event) {
        event.preventDefault()

        var user = regiserPage.find('.user').val(),
            pwd = regiserPage.find('.password').val(),
            repwd = regiserPage.find('.repassword').val()
        if(!user){
            loginShowTips('用户名不能为空！')
            return
        }
        if(!pwd){
            loginShowTips('密码不能为空！')
            return
        }
        if(pwd!==repwd){
            loginShowTips('两次输入的密码不相同，请重新输入')
            return
        }
        $.post('chatRoom/register',{
            user : user,
            password : pwd
        },function (data) {
            loginShowTips(data.msg)
            if(data.success){
                regiserPage.find('input').val('')
                gotologinbtn.click()
            }
        })

    })

    loginbtn.on('click',function (event) {
        event.preventDefault()

        var user = loginPage.find('.user').val(),
            pwd = loginPage.find('.password').val()
        if(!user){
            loginShowTips('用户名不能为空！')
            return
        }
        if(!pwd){
            loginShowTips('密码不能为空！')
            return
        }
        $.post('chatRoom/login',{
            user : user,
            password : pwd
        },function (data) {
            loginShowTips(data.msg)
            if(data.success){
                socket.emit('login')
                loginPage.find('input').val('')
                loginPart.hide()
                chatRoomPart.show()
                userName = data.user.user
                if(data.user.nickname){
                    $('.nickname').val(data.user.nickname)
                    $('.submitInfo').click()
                }
            }
        })
    })

    gotoregisterbtn.on('click',function (event) {
        event.preventDefault()
        loginPage.hide()
        regiserPage.show()
        loginPage.find('input').val('')
    })
    gotologinbtn.on('click',function (event) {
        event.preventDefault()
        loginPage.show()
        regiserPage.hide()
        regiserPage.find('input').val('')
    })

})

//公共方法
function addMessage(data,type,parent) {
    if("string" == typeof parent){
        updateMessageCount(parent)
        parent = currentRoom == parent?null:rooms[parent]
    }
    parent = parent||$('.chatRoom .row')

    var ele = $('<div class="panel panel-'+ type +'">'+
        '<div class="panel-heading">'+ data.name +'<button type="button" class="close"><span>&times;</span></button></div>'+
        '<div class="panel-body">'+ data.message +'</div>'+
        '</div>')
    parent.append(ele)
    ele.find('.close').on('click',function () {
        $(this).parent().parent().remove()
    })
    scrolltobottom()
}

function updateMessageCount(room) {
    if(currentRoom == room)return
    var Pele = $('#'+room)
    var ele = Pele.find('.messageCount')
    if(ele.length!=0){
        var num = Number(ele.html())+1
        ele.html(num)
    }else{
        var newCountEle = $('<span class="badge messageCount">1</span>')
        Pele.append(newCountEle)
    }
}

function createRoom(room) {
    if(rooms[room])return
    var parent = $('<div class="row"></div>')
    var roomName
    roomName = room=='mainRoom'?'聊天室大厅':room
    roomName = roomName=='mainPage'?'聊天室主页':roomName
    if(room!='mainRoom' && room != 'mainPage'){
        addMessage({
            name:"管理员",
            message:"您已加入 "+ roomName +" 房间，快和房间里的小伙伴们打个招呼吧"
        },"info",parent)
    }
    if(room == 'mainRoom'){
        // addMessage({
        //     name:"管理员",
        //     message:"欢迎来到聊天室，在这里你可以畅所欲言。温馨提示：先设置昵称才能开始聊天噢"
        // },"info",parent)
    }
    rooms[room] = parent
}

function createRoomList(room,parent,fn) {

    parent = parent || $('.personRoom')
    var roomName
    roomName = room=='mainRoom'?'聊天室大厅':room
    roomName = roomName=='mainPage'?'聊天室主页':roomName
    var ele = $('<a href="" id="'+ room +'" class="list-group-item">'+ roomName +'<button type="button" class="close leaveRoom">&nbsp;<span>&times;</span></button></a>')
    if(room=='mainRoom'){
        //ele.addClass('active')
        ele.find('button').remove()
    }
    if(room=='mainPage'){
        ele.addClass('active')
        ele.find('button').remove()
    }
    parent.append(ele)
    if(!rooms[room])createRoom(room)
    ele.on('click',function (event) {
        event.preventDefault()
        //if(currentRoom == room)return
        renderChatRoom(rooms[room])
        currentRoom = room
        removeActive($('.roomList .list-group'))
        ele.addClass('active')
        ele.find('.messageCount').remove()
        chatRoom.removeClass('hidden-xs')
        roomList.addClass('hidden-xs')
        back.removeClass('hidden-xs')
        //back.addClass('visible-xs')
    })
    ele.find('.leaveRoom').on('click',function (event) {
        event.preventDefault()
        event.stopPropagation()
        if(currentRoom == room)$('#mainRoom').click()
        $('#' + room).remove()
        delete rooms[room]
        if(fn)fn()
    })
}

function renderChatRoom(newElement) {
    rooms[currentRoom] = $('.chatRoom .row')
    rooms[currentRoom].remove()
    chatRoom.append(newElement)
    newElement.find('.close').on('click',function () {
        $(this).parent().parent().remove()
    })
}

function removeActive(parentElement) {
    parentElement.children().children().removeClass('active')
}

function loginShowTips(tip) {
    tips.html(tip)
    tips.show()
}

function scrolltobottom() {
    var h = $(document).height()-$(window).height();
    $(document).scrollTop(h);
}

function requestFullScreen() {
         var de = document.documentElement;
         if (de.requestFullscreen) {
                de.requestFullscreen();
            } else if (de.mozRequestFullScreen) {
                de.mozRequestFullScreen();
             } else if (de.webkitRequestFullScreen) {
                de.webkitRequestFullScreen();
             }
    }