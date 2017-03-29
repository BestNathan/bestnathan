angular.module("App",[])
    .filter("lyricFilter",function () {
        return function (input) {
            var index = input.indexOf("]")
            return  input.substr(index+1)
        }
    })
    .factory("musicInfoService",function ($http) {
        return {
            getLyrics:function (path) {
                return  path
            }
        }
    })
    .factory("musicService",function ($http,$timeout) {
        var musicsFavourite = [
            {
                id:1,
                name:"童话镇",
                path:"asset/童话镇.mp3",
                lyric:"",
                url:"lyric?hash=ED35367BD830D24073CCE802C075C6AD"
            },
            {
                id:2,
                name:"刚好遇见你",
                path:"asset/刚好遇见你.mp3",
                lyric:"",
                url:"lyric?hash=CB7EE97F4CC11C4EA7A1FA4B516A5D97"
            },
            {
                id:3,
                name:"booty music",
                path:"asset/Deep Side - Booty Music.mp3",
                lyric:"",
                url:"lyric?hash=E7FCF5F615E00D047A828A3525640E16"
            },
            {
                id:4,
                name:"Es rappelt im Karton",
                path:"asset/Pixie Paris - Es rappelt im Karton.mp3",
                lyric:"",
                url:"lyric?hash=9FDEBAA10F5139A62EF0CF577DE63D55"
            },
        ]
        var musicsTryListening = [
            {
                id:5,
                name:"多幸运",
                path:"asset/韩安旭 - 多幸运.mp3",
                lyric:"",
                url:"lyric?hash=EC948599250F456506F328C8F75969C1"
            },
            {
                id:6,
                name:"绅士",
                path:"asset/薛之谦 - 绅士.mp3",
                lyric:"",
                url:"lyric?hash=5F4D1E64E3BF890658A60CA8DC34096B"
            },
            {
                id:7,
                name:"告白气球",
                path:"asset/周二珂 - 告白气球.mp3",
                lyric:"",
                url:"lyric?hash=894A0D3B58A9545D5B73DE7083632E14"
            },
        ]
        var musics = {
            tryListening:musicsTryListening,
            myFavourite:musicsFavourite
        }
        var music = {
            id:5,
            name:"多幸运",
            path:"asset/韩安旭 - 多幸运.mp3",
            lyric:"",
            url:"lyric?hash=EC948599250F456506F328C8F75969C1"
        }
        var pattens = [
            {name:"列表循环",id:1},
            {name:"单曲循环",id:2},
            {name:"随机循环",id:3}
        ]
        var patten = {name:"列表循环",id:1}
        var currentList="tryListening"
        function _setMusic(_music) {
            var _musics = musics[currentList]
            if(_music=='last'){
                music = _musics[_musics.length-1]
                return
            }
            if(_music=='random'){
                var rand = Math.floor(Math.random()*musics[currentList].length)
                music = musics[currentList][rand]
            }
            if(!_music){
                music = _musics[0];
                return
            }
            music = _music
        }
        function init(aaa) {
            if(music.url){
                $http.get(music.url)
                    .success(function (res) {
                        music.path = res.data.play_url;
                        music.lyric = res.data.lyrics;
                        if(aaa)aaa(music)
                    })
            }
        }
        init()
        return  {

            getMusics : function (name) {
                var listName = name||currentList
                return musics[listName]
            },
            getMusic: function () {
                return music
            },
            getMusicById:function (_id) {
                for(var i = 0; i<musics[currentList].length;i++){
                    if(musics[currentList][i].id == _id){
                        return musics[currentList][i]
                    }
                }
            },
            getLastMusicById:function (_id) {
                var _musics = musics[currentList]
                for(var i = 0; i<_musics.length;i++){
                    if(_musics[i].id == _id){
                        if(i == 0){return null}
                        return _musics[i-1]
                    }
                }
            },
            getNextMusicById:function (_id) {
                var _musics = musics[currentList]
                for(var i = 0; i<_musics.length;i++){
                    if(_musics[i].id == _id){
                        if(i==_musics.length-1){return  null}
                        return _musics[i+1]
                    }
                }
            },
            setMusic:function (_music,fn) {
                _setMusic(_music)
                init(fn)
            },
            addMusic:function (_music) {
                _music.id = musics.length + 1;
                musics.push(_music)
            },
            removeMusic:function (_id) {
                for(var i = 0; i<musics.length;i++){
                    if(musics[i].id == _id){
                        musics.splice(i,1);
                        return
                    }
                }
            },
            removeMusics:function () {
                musics = [];
                music={}
            },
            getPatten:function () {
              return patten
            },
            togglePatten: function () {
                var curlp = patten.id
                if(curlp==3){curlp=0}
                patten = pattens[curlp]
            },
            setCurrentList:function (listName) {
                currentList = listName
            },
            getCurrentList:function () {
                return currentList
            }
        }
    })
    .factory("audioService",function () {
        var musicplaying = false,
            audio = new Audio();
        function secTotext(sec) {
            var m,s
            m = isNaN(parseInt(sec / 60))?'0':parseInt(sec / 60)
            s = isNaN(parseInt(sec % 60))?'0':parseInt(sec % 60)
            if(m<10){m='0'+m}
            if(s<10){s='0'+s}
            return m+':'+s
        }
        return  {
            setPath : function (_path) {
                audio.src = _path
            },
            musicPlay : function () {
                musicplaying = true;
                audio.play()
            },
            musicPause : function () {
                audio.pause()
                musicplaying = false
            },
            musicFinish : function () {
                audio.currentTime = 0
                audio.pause()
                musicplaying = false
            },
            musicIsPlaying : function () {
                return musicplaying
            },
            getLength : function () {
                return secTotext(parseInt(audio.duration))
            },
            setCurrent: function (_sec) {
              audio.currentTime = _sec
            },
            getCurrent : function () {
                return secTotext(parseInt(audio.currentTime))
            },
            getPercent:function () {
                var c = parseInt(audio.currentTime)
                var l = parseInt(audio.duration)
                return isNaN((c/l) * 100)?0:(c/l) * 100
            },
            silent: function () {
                audio.muted = !audio.muted
            },
            getAudio : function () {
                return audio
            }
        }
    })
    .controller("musicController",function ($scope,musicService,$rootScope) {
        var vm = $scope.data = {};
        vm.musicstryListening = musicService.getMusics('tryListening');
        vm.musicsmyFavourite = musicService.getMusics('myFavourite');
        vm.tryListening = true;
        vm.myFavourite = true;
        vm.isPlaying = false
        function chengeMusicState(cur) {
            var _musics = vm['musics'+cur];
            var _music = musicService.getMusic();
            for(var i = 0; i < _musics.length;i++){
                _musics[i].playing = false;
                if(_music.id == _musics[i].id){
                    _musics[i].playing = true
                }
            }
        }
        function chengeMusicStateOtherlist(cur) {
            var _musics = vm['musics'+cur];
            for(var i = 0; i < _musics.length;i++){
                _musics[i].playing = false
            }
        }
        $scope.play = function (_music,_list) {
            var curlist = musicService.getCurrentList();
            if(curlist!=_list){chengeMusicStateOtherlist(curlist)}
            musicService.setCurrentList(_list);
            if(_music.url){
                musicService.setMusic(_music,function () {
                    chengeMusicState(_list);
                    $rootScope.$broadcast("musicplay","musicplay")
                    vm.isPlaying = true
                });
            }else {
                musicService.setMusic(_music);
                chengeMusicState(_list);
                $rootScope.$broadcast("musicplay","musicplay")
                vm.isPlaying = true
            }

        };
        $scope.toggleShow = function (name) {
            vm[name] = !vm[name]
        };
        $rootScope.$on('changeMusic',function () {
            var curlist = musicService.getCurrentList();
            chengeMusicState(curlist)
        })

    })
    .controller("musicInfoController",function ($scope, musicService, $http, $rootScope) {
        var vm = $scope.data = {}
        vm.music = musicService.getMusic()
        vm.lyrics = null
        $scope.getLyric = function () {
            vm.music = musicService.getMusic()
            if(vm.music.lyric){
                // $http.get(vm.music.lyric)
                //     .success(function (res) {
                //         var data = res.lrc.lyric
                //         vm.lyrics = data.split("\n")
                //     })
                vm.lyrics = vm.music.lyric.split("\n")
            }else{
                vm.lyrics = null
            }

        }
        $rootScope.$on("musicplay",function (e,a) {
            $scope.getLyric()
        })
        $rootScope.$on("changeMusic",function (e,a) {
            $scope.getLyric()
        })

    })
    .controller("playerController",function ($scope,$timeout, musicService, audioService) {
        var vm = $scope.data = {},
            timer;
        vm.music = {};
        function updateMusic() {
            vm.music.music = musicService.getMusic();
            vm.music.lastmusic = musicService.getLastMusicById(vm.music.music.id);
            vm.music.nextmusic = musicService.getNextMusicById(vm.music.music.id);
            if(!vm.music.lastmusic){vm.music.lastmusic = {};vm.music.lastmusic.name = "无"}
            if(!vm.music.nextmusic){vm.music.nextmusic = {};vm.music.nextmusic.name = "无"}
        }
        updateMusic();
        vm.musicplaying = audioService.musicIsPlaying();
        vm.currentmusic = -1;
        vm.per = 0;
        vm.timenow = '00:00';
        vm.timeall = '00:00';
        vm.loopPatten = musicService.getPatten();
        //一些按钮上绑定的方法
        $scope.play = function () {
            if(!vm.musicplaying){
                var music = vm.music.music;
                if(vm.currentmusic!=music.id){
                    vm.currentmusic=music.id;
                    audioService.setPath(music.path);
                    $scope.$emit('changeMusic','changeMusic')
                }
                audioService.musicPlay();
                if(timer){$timeout.cancel(timer)}
                $timeout(function () {
                    fresh()
                },100)
            }else {
                audioService.musicPause();
                $timeout.cancel(timer)
            }
            vm.musicplaying = audioService.musicIsPlaying();
            updateMusic()
        };
        $scope.playMusic = function () {
            var music = musicService.getMusic();
            audioService.setPath(music.path);
            audioService.musicPlay();
            vm.currentmusic=music.id;
            vm.musicplaying = audioService.musicIsPlaying();
            if(timer){$timeout.cancel(timer)}
            fresh();
            updateMusic()
        };
        $scope.playOtherMusic = function (type,random) {
            var _music;
            type=='next'?
                _music = vm.music.nextmusic:
                _music = vm.music.lastmusic;
            random?
                musicService.setMusic('random'):
                _music.path?
                    musicService.setMusic(_music):
                    type=='last'?
                        musicService.setMusic('last'):
                        musicService.setMusic();
            $scope.$emit('changeMusic','changeMusic');
            $scope.playMusic()
        };
        $scope.replay = function () {
            audioService.getAudio().currentTime=0
        };
        $scope.silent = function () {
            audioService.silent()
        };
        $scope.toggleLoopPatten = function () {
            musicService.togglePatten();
            vm.loopPatten = musicService.getPatten()
        };
        $scope.$on("musicplay",function (e,a) {
            $scope.playMusic()
        });
        var lastEmitTime = '-1'
        function fresh() {
            vm.per = audioService.getPercent();
            vm.timenow = audioService.getCurrent();
            if(vm.timenow != lastEmitTime && !!vm.music.music.lyric){
                $scope.$emit("timeNow",vm.timenow)
                lastEmitTime = vm.timenow
            }
            vm.timeall = audioService.getLength();
            if(vm.timenow==vm.timeall&&vm.timeall!='00:00'){
                audioService.musicFinish();
                vm.musicplaying = audioService.musicIsPlaying();
                if(vm.loopPatten.id==1){
                    $scope.playOtherMusic('next')
                }
                if(vm.loopPatten.id==2){$scope.playMusic()}
                if(vm.loopPatten.id==3){
                    $scope.playOtherMusic('next',true)
                }
                return
            }
            timer = $timeout(function () {
                    fresh()
            },100)
        }
    })
    .directive("showButtons",function () {
        return function (scope,ele,attr) {
            ele.bind("mouseover",function (e) {
                ele.find('div').removeClass('ng-hide')
            });
            ele.bind("mouseout",function () {
                ele.find('div').addClass('ng-hide')
            })
        }
    })
    .directive("currentLyric",function () {
        var obj = {
            controller:function ($scope,$rootScope,$element) {
                function getTime() {
                    var index = $scope.lyric.indexOf("]")
                    return $scope.lyric.substr(1,index).substr(0,5)
                }
                $scope.time = getTime()
                $rootScope.$on("timeNow",function (e,a) {
                    if(a == $scope.time){
                        $element.css({
                            fontWeight:"bold",
                            fontSize:"18px"
                        })
                        var param = {}
                        param.scope = $scope
                        param.ele = $element
                        $rootScope.$broadcast("newLyricIn",param)
                    }
                })
                $scope.$on("newLyricIn",function (e, a) {
                    if(a.scope !== $scope){
                        $element.css({
                            fontWeight:"",
                            fontSize:""
                        })
                    }
                })
            },
            link:function (scope , ele , attr ) {
            }
        }
        return obj
    })
    .directive("myScroll",function ($document) {
        return{
            replace:true,
            template:"<div class='scroll'><div class='scroll-slider'></div><div ng-transclude class='scroll-content'></div></div>",
            transclude:true,
            scope:{
                cheight:'@',
                cwidth:'@',
                lyrics:'@'
            },
            link:function (scope,element,attr,crtl) {
                var slider = element.find(".scroll-slider")
                var content = element.find(".scroll-content")
                var _self = this
                function init() {
                    //初始化scroll
                    element.css({
                        position: "relative",
                        overflow: "hidden",
                        height:scope.cheight+'px',
                        width:scope.cwidth+'px'
                    })
                    //初始化slider
                    var sHeight = Math.pow(element.height(),2)/content.height()
                    var sLeft = element.width()-8
                    slider.css({
                        position: "absolute",
                        left: sLeft+'px',
                        backgroundColor: "lightgrey",
                        width: "8px",
                        height:sHeight+'px',
                    })
                    //初始化content
                    //content.width(content.children()[0].clientWidth)
                    var cLeft = (element.width()-content.width())/2
                    content.css({
                        position: 'absolute',
                        left: cLeft+'px'
                    })
                    //初始化_self
                    _self.startY = 0
                    _self.Top = 0
                    _self.maxTop = element.height() - slider.height()
                }
                function mousemove(event) {
                    _self.Top = event.clientY - _self.startY
                    updateTop()
                    event.stopPropagation()
                    event.preventDefault()
                }
                function updateTop(top) {
                    _self.Top = top || _self.Top
                    if(_self.Top <= 0 )_self.Top = 0
                    if(_self.Top >= _self.maxTop)_self.Top = _self.maxTop
                    slider.css({
                        top:_self.Top +'px'
                    })
                    _self.contentStep = -((content.height()-element.height())*_self.Top)/_self.maxTop
                    var cLeft = (element.width()-content.width())/2
                    content.css({
                        top:_self.contentStep+'px',
                        left: cLeft+'px'
                    })
                }
                function mouseup(event) {
                    $document.unbind("mousemove",mousemove)
                    $document.unbind("mouseup",mouseup)
                    element.bind("mouseenter",mouseenter)
                    element.bind("mouseleave",mouseleave)
                    event.stopPropagation()
                    event.preventDefault()
                }
                function mouseenter(event) {
                    slider.stop(false,true).fadeIn("fast")
                    event.stopPropagation()
                    event.preventDefault()
                }
                function mouseleave(event) {
                    slider.stop(false,true).fadeOut("fast")
                    event.stopPropagation()
                    event.preventDefault()
                }
                slider.bind("mousedown",function (event) {
                    _self.startY = event.clientY - _self.Top
                    $document.bind("mousemove",mousemove)
                    $document.bind("mouseup",mouseup)
                    element.unbind("mouseenter",mouseenter)
                    element.unbind("mouseleave",mouseleave)
                    event.stopPropagation()
                    event.preventDefault()
                })
                element.bind("mouseenter",mouseenter)
                element.bind("mouseleave",mouseleave)
                var count = 0
                var oldlyrics
                var mywatch = scope.$watch(function () {
                    return content.html()
                },function (newvalue,oldvalue,scope) {
                    if(newvalue !== oldvalue){
                        if(count<2)init()
                        if(oldlyrics!==scope.lyrics){
                            console.log(scope.lyrics)
                            count += 1
                            updateTop(0)
                            oldlyrics = scope.lyrics
                        }
                    }
                })
                scope.$on("newLyricIn",function (e,a) {
                    if(a.scope.$index > 4 && a.scope.$index < a.ele.siblings().length-5){
                        var top = (a.scope.$index - 4)*((30*_self.maxTop)/(content.height()-element.height()))
                        updateTop(top)
                    }
                })
            }
        }
    })
;