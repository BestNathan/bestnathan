//定义App，data
var userInfo = {
    username:'',
    isLogin:false,
    currentPath:'',
    navToggle : false,
}




//定义混合

var routeMixin = {
    route:{
        data:function (transition) {
            userInfo.navToggle = false
            userInfo.currentPath = transition.to.path
            Vue.prototype.$progress.finish()
            transition.next()
        }
    }
}

//定义组件

//顶部进度条组件
Vue.component('progressBar',{
    template:'#progressBarTemplate',
    data:function () {
      return progressData
    },
    computed:{
        style:function () {
            return {
                opacity:progressData.show ? 1:0,
                width:progressData.width + '%'
            }
        }
    },
})
//进度条属性
var progressData = {
    show:false,
    width:0,
}
//定义进度条实例方法
//fhgfhg
Vue.prototype.$progress = {
    start:function () {
        var self = this
        progressData.show = true

        this.timer = setInterval(function () {
            progressData.width = progressData.width + 5
            if(progressData.width > 90)self.finish()
        },100)
    },
    finish:function () {
        progressData.width = 100
        this.hide()
    },
    hide:function () {
        clearInterval(this.timer)
        this.timer = null
        setTimeout(function () {
            Vue.nextTick(function () {
                progressData.show = false
                Vue.nextTick(function () {
                    setTimeout(function () {
                        progressData.width = 0
                    },100)
                })
            })
        },800)
    }
}

//提示框组件
Vue.component('modal',{
    template:'#modalTemplate',
    data:function () {
        return{
            show:false,
            title:'',
            content:'',
            eventName:''
        }
    },
    methods:{
        eventBack:function (eventName) {
            if(eventName) this.$dispatch(eventName)
            this.show = false
        }
    },
    events:{
        'showModal':function (modalOptions) {
            this.show = true
            this.title = modalOptions.title
            this.content = modalOptions.content
            this.eventName = modalOptions.eventName
        }
    }
})
//留言内容组件
Vue.component('message',{
    template:'#message',
    props:['message'],
    data:function () {
      return {
          time:''
      }
    },
    methods:{
        test:function () {
            console.log(this)
        }
    },
    computed:{
        'time': function () {
             if(!mdevice){
                 return this.message.createTime?new Date(this.message.createTime * 1000).toLocaleString():''
             }else{
                 return this.message.createTime?new Date(this.message.createTime * 1000).toLocaleDateString():''
             }
        }
    }
})
//前往留言组件
Vue.component('gotoCreate',{
    template:'#gotoCreateTemplate'
})
//欢迎提示组件
Vue.component('welcome',{
    template:'#welcomeTemplate',
    computed:{
        welcomeWords:function () {
            return userInfo.username?'欢迎您，'+userInfo.username:'您当前是匿名用户，请'
        }
    }
})

//创建留言组件
Vue.component('createMessage',{
    template:'#createMessageTemplate',
    data:function () {
        return {
            from:'',
            to:'',
            content:''
        }
    },
    methods:{
        leaveMessage:function () {
            var self = this
            if(!userInfo.username && !this.from){
                this.$broadcast('showModal',{
                    title : '温馨提示',
                    content : '未登录状态下留言人不能为空'
                })
                return
            }
            if(!this.content){
                this.$broadcast('showModal',{
                    title : '温馨提示',
                    content : '留言内容不能为空，请重新输入'
                })
                return
            }
            $.post('/leaveMessage/create',{
                from:userInfo.username?userInfo.username:this.from,
                to:this.to?this.to:'public',
                content:this.content,
                createTime:Date.parse(new Date())/1000
            },function (data) {
                if(data.success){
                    self.$broadcast('showModal',{
                        title : '温馨提示',
                        content : '留言成功',
                        eventName:'createSuccess'
                    })
                }
            })
        },
        back:function () {
            window.history.go(-1)
        }
    },
    events:{
        'createSuccess': function () {
            window.history.go(-1)
        },
    }
})

//登录组件
Vue.component('login',{
    template:'#loginTemplate',
    data:function () {
        return{
            user:'',
            pwd:''
        }
    },
    methods:{
        login:function () {
            if(!this.user||!this.pwd){
                this.$broadcast('showModal',{
                    title : '温馨提示',
                    content : '登录的用户名或密码不能为空，请重新输入'
                })
                return
            }
            var self = this
            $.post('/leaveMessage/login',{
                user:this.user,
                password:this.pwd
            },function (data) {
                self.$broadcast('showModal',{
                    title : '温馨提示',
                    content : data.msg,
                    eventName:data.success?'loginSuccess':''
                })
            })
        }
    },
    events:{
        'loginSuccess':function () {
            userInfo.username = this.user
            userInfo.isLogin = true
            router.go('/user/'+this.user)
        }
    }
})

//注册组件
Vue.component('register',{
    template:'#registerTemplate',
    data:function () {
        return{
            user:'',
            pwd:'',
            repwd:''
        }
    },
    methods:{
        register:function () {
            if(!this.user||!this.pwd||!this.repwd){
                this.$broadcast('showModal',{
                    title : '温馨提示',
                    content : '注册的用户名或密码不能为空，请重新输入'
                })
                return
            }
            if(this.pwd !== this.repwd){
                this.$broadcast('showModal',{
                    title : '温馨提示',
                    content : '两次输入的密码不相同，请重新输入'
                })
                this.pwd = this.repwd = ''
                return
            }
            var self = this
            $.post('/leaveMessage/register',{
                user:this.user,
                password:this.pwd
            },function (data) {
                self.$broadcast('showModal',{
                    title : '温馨提示',
                    content : data.msg,
                    eventName:data.success?'registerSuccess':''
                })
            })
        }
    },
    events:{
        'registerSuccess':function () {
            router.go('/Login')
        }
    }
})

//主页路由
var home = Vue.extend({
    template:'#homeTemplate',
    mixins:[routeMixin],
})
//登录路由
var login = Vue.extend({
    template: '<login></login>',
    mixins:[routeMixin],
    route:{
        canActivate:function () {
            if(userInfo.username){
                return false
            }
        }
    }
})
//注册路由
var register = Vue.extend({
    template: '<register></register>',
    mixins:[routeMixin],
    route:{
        canActivate:function () {
            if(userInfo.username){
                return false
            }
        }
    }
})
//创建留言路由
var createMessage = Vue.extend({
    template:'<create-message></create-message>',
    mixins:[routeMixin],
})
//个人留言板路由
var user = Vue.extend({
    template: '#personTemplate',
    mixins:[routeMixin],
    data:function () {
      return {
          messages:[
              {
                  from:'管理员',
                  to:userInfo.username,
                  content:'以下是'+userInfo.username+'的所有留言内容',
                  createTime:''
              }
          ]
      }
    },
    route:{
        activate:function () {
            if(this.$route.params.username !== userInfo.username){
                router.go('/Login')
            }
        },
        data:function () {
            this.$progress.start()
            var self = this
            $.post('/leaveMessage/messages',{
                to:userInfo.username,
                limit:20,
                page:1
            },function (data) {
                if(data.success){
                    self.messages = self.messages.concat(data.messages)
                }
                setTimeout(function () {
                    self.$progress.finish()
                },200)
            })
        }
    }
})

//公共留言板路由
var common = Vue.extend({
    template:'#commonTemplate',
    mixins:[routeMixin],
    data:function () {
      return{
          messages: [
              {
                  from:'管理员',
                  to:'public',
                  content:'欢迎来到留言板，以下是公共留言内容',
                  createTime:Date.parse(new Date())/1000
              }
          ]
      }
    },
    methods:{
        test:function () {
            console.log(this)
        }
    },
    route:{
        data:function () {
            this.$progress.start()
            var self = this
            $.post('/leaveMessage/messages',{
                to:'public',
                limit:20,
                page:1
            },function (data) {
                if(data.success){
                    self.messages = self.messages.concat(data.messages)
                }
                setTimeout(function () {
                    self.$progress.finish()
                },200)
            })
        }
    }
})

//App组件，主要入口
var App = Vue.extend({
    data:function () {
        return userInfo
    },
    methods:{
        quit:function () {
            userInfo.username=''
            userInfo.isLogin = false
            if(this.$route.params.username){
                router.go('/public')
            }
        },
        toggle:function () {
            userInfo.navToggle = !userInfo.navToggle
        }
    }
})
//创建路由
var router = new VueRouter()
//路由定义
router.map({
    '/Home':{
      component:home
    },
    '/Login': {
        component: login
    },
    '/Register': {
        component: register
    },
    '/user/:username':{
        component:user
    },
    '/user':{
        component:{
            route:{
                activate:function () {
                    router.go('/Login')
                }
            }
        }
    },
    '/public':{
        component:common
    },
    '/createMessage':{
        component:createMessage
    }
})
//启动路由
router.start(App, '#app')
//默认路由到主页
router.go('/Home')