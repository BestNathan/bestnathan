/**
 * Created by nathan on 2017/3/10.
 */
$(function () {
    var toggleBtn = $('.navbar-toggle'),
        toggle = false
    var chatRoom = $('.chatRoom')
    var drawSetting = $('.drawSetting'),
        subAnswer = $('.subAnswer')
    drawSetting.hide()
    subAnswer.hide()
    var tips = $('.bigTip'),
        canvas = $('.canvas'),
        tip = $('.tip'),
        nickSet = $('.nickSetting'),
        nickSubBtn = $('.subNick'),
        picSet = $('.picSetting'),
        picSubBtn = $('.subPicInfo'),
        mes = $('.myMessage'),
        mesSub = $('.subMessage'),
        mesSubBtn = $('.submitMessage')
    picSet.hide()
    var tipsWidth = canvas.width(),
        tipsHeight = canvas.height()
    tips.css({
        width: tipsWidth + 'px',
        height: tipsHeight + 'px'
    }).find('p').css({
        paddingTop: tipsHeight/3 +'px',
        fontSize: tipsWidth/30 +'px'
    })

    if(!window.mdevice){
        tips.find('.input-group').css({
            width: '65%',
            marginLeft: '19%'
        })
        chatRoom.css({
            height : canvas.height()-35  + 'px'
        })
    }else{
        // drawSetting.css({
        //     position: 'absolute',
        //     left: '0',
        //     top: '400px'
        // })
        // subAnswer.css({
        //     position: 'absolute',
        //     left: '0',
        //     top: '400px'
        // })
        chatRoom.css({
            position:'absolute',
            height : window.screen.availHeight - 180 - width  + 'px',
            bottom: '35px',
            marginBottom:'0',
            left:'0'
        })
        mesSub.css({
            position:'absolute',
            bottom:'0',
            marginBottom:'0',
            left:'0'
        })
    }

    var lineSize = $('.lineSize'),
        lineColor = $('.lineColor'),
        penBtn = $('.pen'),
        eraserBtn = $('.eraser'),
        clearUpBtn = $('.clearUp'),
        answer = $('.answer'),
        subBtn = $('.submitAnswer')
    var color = '#000000'
    //我要画图
    var toDraw = $('.toDraw')
    var toOver = $('.toOver')
    toDraw.on('click',function (event) {
        event.preventDefault()
        if(!nick){
            showTip("请先设置昵称",1000)
            return
        }
        if(gaming){
            showTip("当前游戏正在进行",1000,true)
            return
        }
        mySocket.emit('gameStart',nick)
        painter = true
        showPicSetting()
        if(window.mdevice){
            toggleBtn.click()
        }
    })
    toOver.on('click',function (event) {
        event.preventDefault()
        if(!painter)return
        mySocket.emit('gameOver')
        gameOver()
        if(window.mdevice){
            toggleBtn.click()
        }
    })
    function gameOver() {
        mycanvas.unbindEvent()
        painter = false
        gaming = false
        picAnswer = undefined
        picTip = undefined
        mycanvas.clearUp()
        drawSetting.hide()
        subAnswer.hide()
        picSet.hide()
        showTip("当前没有人在画图")
    }

    //一些绑定事件
    lineSize.on('change',function (event) {
        var size = lineSize.val()
        mycanvas.setLineWidth(size)
    })
    lineColor.on('change',function (event) {
        color = lineColor.val()
        if(eraserBtn.hasClass('active'))return
        mycanvas.setColor(color)
    })
    penBtn.on('click',function (event) {
        mycanvas.setColor(color)
        eraserBtn.removeClass('active')
        penBtn.addClass('active')
    })
    eraserBtn.on('click',function (event) {
        mycanvas.setColor('#cfffc5')
        penBtn.removeClass('active')
        eraserBtn.addClass('active')
    })
    clearUpBtn.on('click',function (event) {
        mycanvas.clearUp()
        mySocket.emit('clearUp')
    })
    subBtn.on('click',function (event) {
        event.preventDefault()
        var guess = answer.val()
        if(!guess){
            showTip("答案不能为空",1000,true)
            return
        }
        if(guess==picAnswer){
            mySocket.emit('guessRight',nick)
            addMessage('恭喜你猜对了','游戏管理员')
        }else{
            var obj = {}
            obj.nick = nick
            obj.guess = guess
            mySocket.emit('guessWrong',obj)
            addMessage(guess,'me')
        }
        answer.val('')
    })
    mesSubBtn.on('click',function (event) {
        event.preventDefault()
        if(!nick)return addMessage("请先设置昵称",'游戏管理员')
        var message = mes.val()
        if(!message)return
        mySocket.emit('guessWrong',{
            nick:nick,
            guess:message
        })
        addMessage(message,'me')
        mes.val('')
    })
    toggleBtn.on('click',function (event) {
        event.preventDefault()
        var toggleEle = $('.navbar-collapse')
        if(!toggle){
            toggleEle.removeClass('collapse')
        }else{
            toggleEle.addClass('collapse')
        }
        toggle = !toggle
    })


    //昵称设置相关
    nickSubBtn.on('click',function (event) {
        event.preventDefault()
        var _nick = nickSet.find('.nick').val()
        if(!_nick){
            showTip("昵称不能设置为空")
            return
        }
        mySocket.emit('subNick',_nick)
    })
    //游戏开始设置
    picSubBtn.on('click',function (event) {
        event.preventDefault()
        picAnswer = picSet.find('.picAnswer').val()
        picTip = picSet.find('.picTips').val()
        if(!picAnswer || !picTip){
            showTip("答案或提示语不能为空")
            return
        }
        var obj = {}
        obj.answer = picAnswer
        obj.tip = picTip
        mySocket.emit('answerAndTip',obj)
        showTip("请开始你的表演",1000,true)
        mycanvas.bindEvent()
        mycanvas.init(lineSize.val(),lineColor.val())
        drawSetting.show()
        picSet.find('input').val('')
    })
    //需要内部变量的 socket事件
    mySocket.on('exist',function () {
        showTip("当前昵称已存在",1000)
    })
    mySocket.on('nicked',function (data) {
        nickSet.hide()
        nick = data
        mySocket.emit('gaming')
    })
    mySocket.on('newPlayer',function (data) {
        addMessage(data+"加入到了游戏中","游戏管理员")
    })
    //游戏事件监听
    mySocket.on('gameStart',function (data) {
        if(!nick)return
        gaming = true
        showTip(data + "正在思考画什么")
        addMessage(data + "要开始作画了","游戏管理员")
        subAnswer.show()
    })
    mySocket.on('gaming',function (data) {
        if(!nick)return
        gaming = data
        if(data){
            tips.hide()
            mySocket.emit('joinGaming',nick)
            subAnswer.show()
        }else{
            showTip("当前没有人在画图")
        }
    })
    mySocket.on('gameOver',function () {
        if(!nick)return
        gameOver()
    })
    mySocket.on('answerAndTip',function (data) {
        console.log(data)
        if(!nick)return
        picAnswer = data.answer
        var length = picAnswer.length
        picTip = data.tip
        showTip(data.nick + "开始了他的表演",1000,true)
        addMessage('提示：'+picTip+'('+ length +'个字)','游戏管理员')
    })
    mySocket.on('guessRight',function (data) {
        if(!nick)return
        addMessage(data+'已经猜对了，其他人要加油哦','游戏管理员')
    })
    mySocket.on('guessWrong',function (data) {
        if(!nick)return
        addMessage(data.guess,data.nick)
    })

    //私有方法
    function showTip(content , time ,out) {
        tip.html(content)
        if(out){
            nickSet.hide()
            picSet.hide()
            if(time!=-1){
                setTimeout(function () {
                    tips.fadeOut()
                },time)
            }
        }
        tips.fadeIn()
    }
    function showPicSetting() {
        nickSet.hide()
        picSet.show()
        showTip("请填写答案和提示语",-1)
    }
    function addMessage(content,nick) {
        var mesEle = $('<div class="message">'+
            '<p class="content"><span class=""></span>'+ content +'</p>'+
            '</div>')
        if(nick=='me'){
            mesEle.find('span').addClass('right')
            mesEle.find('.content').addClass('pull-right')
        }else{
            mesEle.find('span').addClass('left')
            var nameEle = $('<div class="person"><p class="name">'+ nick +'</p></div>')
            mesEle.prepend(nameEle)
        }
        chatRoom.append(mesEle)
        scrolltobottom()
    }
    function scrolltobottom() {
        var h = chatRoom.prop('scrollHeight') - chatRoom.height();
        chatRoom.scrollTop(h);
    }
    window.addMessage = addMessage
})