/**
 * Created by nathan on 2017/3/10.
 */
function myCanvas(canvasId,width,height) {
    var _this = this
    //canvas变量
    var canvas = document.getElementById(canvasId)
    var context = canvas.getContext('2d')
    var jcanvas = $(canvas)
    //canvas参数变量
    var rect
    //画图变量
    var paint = false,
        paintData,
        x,
        y
    //监听其他canvas变量
    var listenWidth,
        listenHeight,
        listenLineWidth
    //一些初始化设置
    canvas.width = width||800
    canvas.height = height||600
    context.fillStyle = "#cfffc5"
    context.fillRect(0,0,canvas.width,canvas.height)
    context.lineCap = 'round'
    context.lineJoin = 'bevel'
    setLineWidth(5)
    //初始化
    this.init = function (width,color) {
        setLineWidth(width)
        setColor(color)
    }
    //一些绘画方法
    this.drawBegin = function (beginX, beginY) {
        paint = true
        context.beginPath()
        context.moveTo(beginX , beginY)
        context.lineTo(beginX + 0.1 , beginY + 0.1)
        context.stroke()
    }
    this.drawing = function (targetX, targetY) {
        if(paint){
            context.lineTo(targetX , targetY)
            context.stroke()
        }
    }
    this.drawEnd = function () {
        paint = false
        paintData = context.getImageData(0,0,canvas.width,canvas.height)
    }
    this.clearUp = function () {
        context.fillRect(0,0,canvas.width,canvas.height)
    }
    this.toMyCanvasXY = function (XY) {
        if(!listenWidth || !listenHeight)return XY
        var obj = {},
            _x,
            _y
        _x = XY.x * canvas.width / listenWidth
        _y = XY.y * canvas.height / listenHeight
        obj.x = _x
        obj.y = _y
        return obj
    }
    this.toMyCanvasLineWidth = function (lineWidth) {
        var wid = parseInt(lineWidth * canvas.width / listenWidth)
        return wid==0?wid+1:wid
    }
    //设置方法
    function setColor(color) {
        context.strokeStyle = color
    }
    this.setColor = setColor
    function setLineWidth (width) {
        context.lineWidth = width * 2
    }
    this.setLineWidth = setLineWidth
    this.setListenWH = function (obj) {
        listenWidth = obj.width
        listenHeight = obj.height
    }
    this.setPicData = function (data) {
        // var _canvas  = document.createElement("canvas")
        // var _context = _canvas.getContext('2d')
        // _canvas.width = data.width
        // _canvas.height = data.height
        // _context.putImageData(data,0,0)
        var img = new Image()
        img.src = data
        context.drawImage(img,0,0,canvas.width,canvas.height)
    }
    //获取方法
    this.getWH = function () {
        var obj = {}
        obj.width = canvas.width
        obj.height = canvas.height
        return obj
    }
    this.getPicData = function () {
        return canvas.toDataURL()
    }
    function bindEvent() {
        if(!window.mdevice){
            //非触摸端canvas绑定事件
            jcanvas.on("mousedown",function (event) {
                if(!window.mdevice){
                    rect = canvas.getBoundingClientRect()
                    x = event.clientX - rect.left
                    y = event.clientY - rect.top
                    _this.drawSetting()
                    _this.drawBegin(x,y)
                    mySocket.emit('drawBegin',{x:x,y:y})
                }
            })
            jcanvas.on("mousemove",function (event) {
                if(!window.mdevice){
                    if(!rect)rect = canvas.getBoundingClientRect()
                    x = event.clientX - rect.left
                    y = event.clientY - rect.top
                    _this.drawing(x,y)
                    mySocket.emit('drawing',{x:x,y:y})
                }
            })
            jcanvas.on("mouseup",function (event) {
                if(!window.mdevice){
                    _this.drawEnd()
                    mySocket.emit('drawEnd')
                }
            })
            jcanvas.on("mouseleave",function (event) {
                if(!window.mdevice){
                    _this.drawEnd()
                    mySocket.emit('drawEnd')
                }
            })
        }else{
            //触摸端canvas绑定事件
            jcanvas.on("touchstart",function (event) {
                if(window.mdevice){
                    event.preventDefault()
                    event = event.originalEvent.touches[0]||event
                    rect = canvas.getBoundingClientRect()
                    x = event.clientX - rect.left
                    y = event.clientY - rect.top
                    _this.drawSetting()
                    _this.drawBegin(x,y)
                    mySocket.emit('drawBegin',{x:x,y:y})
                }
            })
            jcanvas.on("touchmove",function (event) {
                if(window.mdevice){
                    event.preventDefault()
                    if(!rect)rect = canvas.getBoundingClientRect()
                    event = event.originalEvent.touches[0]||event
                    x = event.clientX - rect.left
                    y = event.clientY - rect.top
                    _this.drawing(x,y)
                    mySocket.emit('drawing',{x:x,y:y})
                }
            })
            jcanvas.on("touchend",function (event) {
                if(window.mdevice){
                    event.preventDefault()
                    _this.drawEnd()
                    mySocket.emit('drawEnd')
                }
            })
        }
    }
    function unbindEvent() {
        if(!window.mdevice){
            //非触摸端canvas绑定事件
            jcanvas.unbind("mousedown",function (event) {
                if(!window.mdevice){
                    x = event.clientX - canvasLeft
                    y = event.clientY - canvasTop
                    _this.drawBegin(x,y)
                    _this.drawing(x+1,y+1)
                }
            })
            jcanvas.unbind()
            jcanvas.unbind("mousemove",function (event) {
                if(!window.mdevice){
                    x = event.clientX - canvasLeft
                    y = event.clientY - canvasTop
                    _this.drawing(x,y)
                }
            })
            jcanvas.unbind("mouseup",function (event) {
                if(!window.mdevice){
                    _this.drawEnd()
                }
            })
            jcanvas.unbind("mouseleave",function (event) {
                if(!window.mdevice){
                    _this.drawEnd()
                }
            })
        }else{
            //触摸端canvas绑定事件
            jcanvas.unbind("touchstart",function (event) {
                if(window.mdevice){
                    x = event.clientX - canvasLeft
                    y = event.clientY - canvasTop
                    _this.drawBegin(x,y)
                }
            })
            jcanvas.unbind("touchmove",function (event) {
                if(window.mdevice){
                    x = event.clientX - canvasLeft
                    y = event.clientY - canvasTop
                    _this.drawing(x,y)
                }
            })
            jcanvas.unbind("touchend",function (event) {
                if(window.mdevice){
                    _this.drawEnd()
                }
            })
        }
    }
    this.bindEvent = bindEvent
    this.unbindEvent = unbindEvent
    this.drawSetting = function () {
        var properties = {}
        properties.width = canvas.width
        properties.height = canvas.height
        properties.lineWidth = context.lineWidth/2
        properties.strokeStyle = context.strokeStyle
        mySocket.emit('drawSetting',properties)
    }
    this.joinGaming = function () {
        mySocket.emit('joinGmaing',this.nick)
    }
    //socket监听绑定
    

}