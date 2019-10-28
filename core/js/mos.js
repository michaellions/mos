;(function($,window,document,undefined){
    jQuery(function() {
        //插件制作
        $.fn.mosdrag = function (opt) {
            var call = {
                scope: null,//父级
                grid: null,//网格
                axis:"all",//上下或者左右
                pos:false,//是否记住位置
                handle:null,//手柄
                moveClass:"moscls",//移动时不换位加的class
                dragChange:false,//是否开启拖拽换位
                changeMode:"point",//point & sort
                cbStart:function(){},//移动前的回调函数
                cbMove:function(){},//移动中的回调函数
                cbEnd:function(){},//移动结束时候的回调函数
                random:false,//是否自动随机排序
                randomInput:null,//点击随机排序的按钮
                animation_options:{//运动时的参数
                    duration:500,//每次运动的时间
                    easing:"ease-out"//移动时的特效，ease-out、ease-in、linear
                },
                disable:false,//禁止拖拽
                disableInput:null//禁止拖拽的按钮
            };
            var dragfn = new Dragfn(this, opt);
            if (opt && $.isEmptyObject(opt) == false) {
                dragfn.options = $.extend(call, opt);
            } else {
                dragfn.options = call;
            }
            dragfn.firstRandom=true;
            var ele = dragfn.$element;
            dragfn.pack(ele,false);
            if(dragfn.options.randomInput!=null){
                $(dragfn.options.randomInput).bind("click",function(){
                    dragfn.pack(ele,true);
                })
            }
            //加载拓展jquery的函数
            dragfn.loadJqueryfn()
        };

        //依赖构造函数
        var Dragfn = function (ele, opt) {
            this.$element = ele;
            this.options = opt;
        };
        //构造函数方法
        Dragfn.prototype = {
            init: function (obj) {
                var self = this;
                self.ele=self.$element;
                self.handle=$(obj);//手柄
                self.options = self.options;
                self.disable = self.options.disable;
                self._start = false;
                self._move = false;
                self._end = false;
                self.disX = 0;
                self.disY = 0;
                self.zIndex=1000;
                self.moving=false;
                self.moves="";
                //父级
                self.box = $.type(self.options.scope)==="string" ? self.options.scope : null;
                //手柄
                if(self.options.handle!=null){
                    self.handle=$(obj).find(self.options.handle);
                }
                //三个事件
                self.handle.on("mousedown", function (ev) {
                    self.start(ev, obj);
                    obj.setCapture && obj.setCapture();
                    return false;
                });
                if(self.options.dragChange) {
                    $(obj).on("mousemove", function (ev) {
                        self.move(ev, obj);
                    });
                    $(obj).on("mouseup", function (ev) {
                        self.end(ev, obj);
                    });
                }else{
                    $(document).on("mousemove", function (ev) {
                        self.move(ev, obj);
                    });
                    $(document).on("mouseup", function (ev) {
                        self.end(ev, obj);
                    });
                }
            },
            //jquery调取函数时候用
            loadJqueryfn: function(){
                var self=this;
                $.extend({
                    //返回按照index排序的回调函数
                    sortBox:function(obj){
                        var arr=[];
                        for (var s = 0; s < $(obj).length; s++) {
                            arr.push($(obj).eq(s));
                        }
                        for ( var i = 0; i < arr.length; i++) {
                            for ( var j = i + 1; j < arr.length; j++) {
                                if(Number(arr[i].attr("index")) > Number(arr[j].attr("index"))){
                                    var temp = arr[i];
                                    arr[i] = arr[j];
                                    arr[j] = temp;
                                }
                            }
                        }
                        return arr
                    },
                    //随机排序函数
                    randomfn:function(obj){
                        self.pack($(obj),true);
                    },
                    //开启拖拽
                    disable_open:function(){
                        self.disable=false;
                    },
                    //禁止拖拽
                    disable_cloose:function(){
                        self.disable=true;
                    }
                });
            },
            toDisable: function(){
                var self=this;
                if(self.options.disableInput!=null){
                    $(self.options.disableInput).bind("click",function(){
                        if(self.disable==true){
                            self.disable=false
                        }else{
                            self.disable=true
                        }
                    })
                }
            },
            start: function (ev, obj) {
                var self = this;
                self.moved=obj;
                if (self.disable == true) {
                    return false
                }
                self._start = true;
                var oEvent = ev || event;
                self.disX = oEvent.clientX - obj.offsetLeft;
                self.disY = oEvent.clientY - obj.offsetTop;
                $(obj).css("zIndex",self.zIndex++);
                self.options.cbStart();
            },
            move: function (ev, obj) {
                var self = this;
                if (self._start != true) {
                    return false
                }
                if(obj!=self.moved){
                    return false
                }
                self._move = true;
                var oEvent = ev || event;
                var l = oEvent.clientX - self.disX;
                var t = oEvent.clientY - self.disY;
                //有父级限制
                if (self.box != null) {
                    var rule = self.collTestBox(obj,self.box);
                    if (l > rule.lmax) {
                        l = rule.lmax;
                    } else if (l < rule.lmin) {
                        l = rule.lmin;
                    }
                    if (t > rule.tmax) {
                        t = rule.tmax;
                    } else if (t < rule.tmin) {
                        t = rule.tmin;
                    }
                }
                if(self.options.axis=="all"){
                    obj.style.left = self.grid(obj, l, t).left  + 'px';
                    obj.style.top = self.grid(obj, l, t).top  + 'px';
                }else if(self.options.axis=="y"){
                    obj.style.top = self.grid(obj, l, t).top  + 'px';
                }else if(self.options.axis=="x"){
                    obj.style.left = self.grid(obj, l, t).left + 'px';
                }
               /* if(self.options.changeWhen=="move") {
                    if (self.options.changeMode == "sort") {
                        self.sortDrag(obj);
                    } else if (self.options.changeMode == "point") {
                        self.pointmoveDrag(obj);
                    }
                }else{
                    self.moveAddClass(obj);
                }*/
                if(self.options.pos==true){
                    self.moveAddClass(obj);
                }
                self.options.cbMove(obj,self);

            },
            end: function (ev, obj) {
                var self = this;
                if (self._start != true) {
                    return false
                }
                if(self.options.changeMode=="sort"&&self.options.pos==true){
                    self.sortDrag(obj);
                }else if(self.options.changeMode=="point"&&self.options.pos==true){
                    self.pointDrag(obj);
                }
                if(self.options.pos==true){
                    self.animation(obj, self.aPos[$(obj).attr("index")]);
                }
                self.options.cbEnd();
                if(self.options.handle!=null){
                    $(obj).find(self.options.handle).unbind("onmousemove");
                    $(obj).find(self.options.handle).unbind("onmouseup");
                }else{
                    $(obj).unbind("onmousemove");
                    $(obj).unbind("onmouseup");
                }
                obj.releaseCapture && obj.releaseCapture();
                self._start = false;

            },
            //算父级的宽高
            collTestBox: function (obj, obj2) {
                var self = this;
                var l1 = 0;
                var t1 = 0;
                var l2 = $(obj2).innerWidth() - $(obj).outerWidth();
                var t2 = $(obj2).innerHeight() - $(obj).outerHeight();
                return {
                    lmin: l1,//取的l最小值
                    tmin: t1,//取的t最小值
                    lmax: l2,//取的l最大值
                    tmax: t2//取的t最大值
                }

            },
            //算父级宽高时候干掉margin
            grid: function (obj, l, t) {//cur:[width,height]
                var self = this;
                var json = {
                    left: l,
                    top: t
                };
                if ($.isArray(self.options.grid) && self.options.grid.length == 2) {
                    var gx = self.options.grid[0];
                    var gy = self.options.grid[1];
                    json.left = Math.floor((l + gx / 2) / gx) * gx;
                    json.top = Math.floor((t + gy / 2) / gy) * gy;
                    return json
                } else if (self.options.grid == null) {
                    return json
                } else {
                    console.log("grid参数传递格式错误");
                    return false
                }
            },
            findNearest: function(obj){
                var self=this;
                var iMin=new Date().getTime();
                var iMinIndex=-1;
                var ele=self.ele;
                for(var i=0;i<ele.length;i++){
                    if(obj==ele[i]){
                        continue;
                    }
                    if(self.collTest(obj,ele[i])){
                        var dis=self.getDis(obj,ele[i]);
                        if(dis<iMin){
                            iMin=dis;
                            iMinIndex=i;
                        }
                    }
                }
                if(iMinIndex==-1){
                    return null;
                }else{
                    return ele[iMinIndex];
                }
        },
            getDis: function(obj,obj2){
                var self=this;
                var l1=obj.offsetLeft+obj.offsetWidth/2;
                var l2=obj2.offsetLeft+obj2.offsetWidth/2;

                var t1=obj.offsetTop+obj.offsetHeight/2;
                var t2=obj2.offsetTop+obj2.offsetHeight/2;

                var a=l2-l1;
                var b=t1-t2;

            return Math.sqrt(a*a+b*b);
        },
            collTest: function(obj,obj2){
                var self=this;
                var l1=obj.offsetLeft;
                var r1=obj.offsetLeft+obj.offsetWidth;
                var t1=obj.offsetTop;
                var b1=obj.offsetTop+obj.offsetHeight;

                var l2=obj2.offsetLeft;
                var r2=obj2.offsetLeft+obj2.offsetWidth;
                var t2=obj2.offsetTop;
                var b2=obj2.offsetTop+obj2.offsetHeight;

                if(r1<l2 || r2<l1 || t2>b1 || b2<t1){
                    return false;
                }else{
                    return true;
                }
        },
            //初始布局转换
            pack: function(ele,click){
                var self=this;
                self.toDisable();
                if(self.options.pos==false){
                    for (var i = 0; i < ele.length; i++) {
                        $(ele[i]).css("position", "absolute");
                        $(ele[i]).css("margin", "0");
                        self.init(ele[i]);
                    }
                }else if(self.options.pos==true) {
                    var arr = [];
                    if (self.options.random || click) {
                        while (arr.length < ele.length) {
                            var n = self.rnd(0, ele.length);
                            if (!self.finInArr(arr, n)) {//没找到
                                arr.push(n);
                            }
                        }
                    }
                    if (self.options.random == false || click != true) {
                        var n = 0;
                        while (arr.length < ele.length) {
                            arr.push(n);
                            n++
                        }
                    }

                    //如果是第二次以后随机列表，那就重新排序后再随机，因为我智商不够使，不会排了
                    if (self.firstRandom == false) {
                        var sortarr = [];
                        var n = 0;
                        while (sortarr.length < ele.length) {
                            sortarr.push(n);
                            n++
                        }
                        for (var i = 0; i < ele.length; i++) {
                            $(ele[i]).attr("index", sortarr[i]);
                            $(ele[i]).css("left", self.aPos[sortarr[i]].left);
                            $(ele[i]).css("top", self.aPos[sortarr[i]].top);
                        }
                    }

                    //布局转化
                    self.aPos = [];
                    if (self.firstRandom == false) {
                        //不是第一次
                        for (var j = 0; j < ele.length; j++) {
                            self.aPos[j] = {
                                left: ele[$(ele).eq(j).attr("index")].offsetLeft,
                                top: ele[$(ele).eq(j).attr("index")].offsetTop
                            };
                        }
                    } else {
                        //第一次
                        for (var j = 0; j < ele.length; j++) {
                            self.aPos[j] = {left: ele[j].offsetLeft, top: ele[j].offsetTop};
                        }
                    }
                    //第二个循环布局转化
                    for (var i = 0; i < ele.length; i++) {
                        $(ele[i]).attr("index", arr[i]);
                        $(ele[i]).css("left", self.aPos[arr[i]].left);
                        $(ele[i]).css("top", self.aPos[arr[i]].top);
                        $(ele[i]).css("position", "absolute");
                        $(ele[i]).css("margin", "0");
                        self.init(ele[i]);
                    }
                    self.firstRandom = false;
                }
            },
            //移动时候加class
            moveAddClass: function(obj){
                var self=this;
                var oNear=self.findNearest(obj);
                $(self.$element).removeClass(self.options.moveClass);
                if(oNear && $(oNear).hasClass(self.options.moveClass)==false){
                    $(oNear).addClass(self.options.moveClass);
                }

            },
            //给li排序
            sort: function(){
                var self=this;
                var arr_li=[];
                for (var s = 0; s < self.$element.length; s++) {
                    arr_li.push(self.$element[s]);
                }
                for ( var i = 0; i < arr_li.length; i++) {
                    for ( var j = i + 1; j < arr_li.length; j++) {
                        if(Number($(arr_li[i]).attr("index")) > Number($(arr_li[j]).attr("index"))){
                            var temp = arr_li[i];
                            arr_li[i] = arr_li[j];
                            arr_li[j] = temp;
                        }
                    }
                }
                return arr_li;
            },
            //点对点的方式换位
            pointDrag: function(obj){
                var self=this;
                //先拍序
                var oNear=self.findNearest(obj);
                if (oNear) {
                    self.animation(obj,self.aPos[$(oNear).attr("index")]);
                    self.animation(oNear, self.aPos[$(obj).attr("index")]);
                    var tmp;
                    tmp = $(obj).attr("index");
                    $(obj).attr("index", $(oNear).attr("index"));
                    $(oNear).attr("index", tmp);
                    $(oNear).removeClass(self.options.moveClass);
                } else if (self.options.changeWhen == "end") {
                    self.animation(obj, self.aPos[$(obj).attr("index")]);
                }

            },
            //排序的方式换位
            sortDrag: function(obj){
                var self=this;
                //先拍序
                var arr_li=self.sort();
                //换位置
                var oNear=self.findNearest(obj);
                    if(oNear){
                        if(Number($(oNear).attr("index"))>Number($(obj).attr("index"))){
                            //前换后
                            var obj_tmp=Number($(obj).attr("index"));
                            $(obj).attr("index",Number($(oNear).attr("index"))+1);
                            for (var i = obj_tmp; i < Number($(oNear).attr("index"))+1; i++) {
                                self.animation(arr_li[i],self.aPos[i-1]);
                                self.animation(obj,self.aPos[$(oNear).attr("index")]);
                                $(arr_li[i]).removeClass(self.options.moveClass);
                                $(arr_li[i]).attr("index",Number($(arr_li[i]).attr("index"))-1);
                            }

                        }else if(Number($(obj).attr("index"))>Number($(oNear).attr("index"))){
                            //后换前
                            var obj_tmp=Number($(obj).attr("index"));
                            $(obj).attr("index",$(oNear).attr("index"));
                            for (var i = Number($(oNear).attr("index")); i < obj_tmp; i++) {
                                self.animation(arr_li[i],self.aPos[i+1]);
                                self.animation(obj,self.aPos[Number($(obj).attr("index"))]);
                                $(arr_li[i]).removeClass(self.options.moveClass);
                                $(arr_li[i]).attr("index",Number($(arr_li[i]).attr("index"))+1);
                            }
                        }
                    }else{
                        self.animation(obj,self.aPos[$(obj).attr("index")]);
                    }

            },
            //运动函数(后期再加参数)
            animation: function(obj,json){
                var self=this;
                //考虑默认值
                var options=self.options.animation_options; /*|| {};
                options.duration=self.options.animation_options.duration || 800;
                options.easing=options.easing.duration.easing || 'ease-out';*/
                var self=this;
                var count=Math.round(options.duration/30);
                var start={};
                var dis={};
                for(var name in json){
                    start[name]=parseFloat(self.getStyle(obj,name));
                    if(isNaN(start[name])){
                        switch(name){
                            case 'left':
                                start[name]=obj.offsetLeft;
                                break;
                            case 'top':
                                start[name]=obj.offsetTop;
                                break;
                            case 'width':
                                start[name]=obj.offsetWidth;
                                break;
                            case 'height':
                                start[name]=obj.offsetHeight;
                                break;
                            case 'marginLeft':
                                start[name]=obj.offsetLeft;
                                break;
                            case 'borderWidth':
                                start[name]=0;
                                break;
                            //...
                        }
                    }
                    dis[name]=json[name]-start[name];
                }

                var n=0;

                clearInterval(obj.timer);
                obj.timer=setInterval(function(){
                    n++;
                    for(var name in json){
                        switch(options.easing){
                            case 'linear':
                                var a=n/count;
                                var cur=start[name]+dis[name]*a;
                                break;
                            case 'ease-in':
                                var a=n/count;
                                var cur=start[name]+dis[name]*a*a*a;
                                break;
                            case 'ease-out':
                                var a=1-n/count;
                                var cur=start[name]+dis[name]*(1-a*a*a);
                                break;
                        }

                        if(name=='opacity'){
                            obj.style.opacity=cur;
                            obj.style.filter='alpha(opacity:'+cur*100+')';
                        }else{
                            obj.style[name]=cur+'px';
                        }
                    }

                    if(n==count){
                        clearInterval(obj.timer);
                        options.complete && options.complete();
                    }
                },30);
        },
            getStyle: function(obj,name){
                return (obj.currentStyle || getComputedStyle(obj,false))[name];
            },
            //随机数
            rnd: function(n,m){
                return parseInt(Math.random()*(m-n)+n);
            },
            //在数组中找
            finInArr: function(arr,n){
                for(var i = 0 ; i < arr.length; i++){
                    if(arr[i] == n){//存在
                        return true;
                    }
                }
                return false;
            }
        }
    })
})(jQuery,window,document);
/*mos*/
window.mos = {
    _title:"WebOS-MOS",
    _version:'Ver 2018.06.0201',
    _debug:true,
    _bgs:{
        main:'',
        mobile:''
    },
    _countTask: 0,
    _newMsgCount:0,
    _slideTimer:null,//幻灯片定时器
    _RootPath:"",//网站根目录
    _username:"",//登录的用户名
    _windows:{},//所有窗口信息-在任务栏中间的窗口-json对象
    _AlluserDataSet:[],//所有用户信息
    _userDataSet:[],//当前登录用户的信息
    _userdesktopDataSet:[],//当前登录用户的桌面信息
    _usersetupDataSet:[],//当前登录用户的设置信息
    _userCmenuDataSet:[],//当前登录用户的右键菜单数据
    _lockscreenindex:"",//锁屏索引
    _lockscreenTimer:null,//锁屏定时器
    _publicIntervalTimer:null,//公共定时-动态壁纸及其他定时器
    _publicsettimeoutTimer:null,//公共定时-动态壁纸及其他定时器
    _dynamicwallpaperid:"",//动态壁纸id
    _animated_classes:[],
    _animated_liveness:0,
    _switchMenuTooHurry:false,
    _screenheight:0,//浏览器当前窗口可视区域高度
    _screenwidth:0,//浏览器当前窗口可视区域宽度
    _lang:'zh-CN',
    _iframeOnClick :{
        resolution: 200,
        iframes: [],
        interval: null,
        Iframe: function() {
            this.element = arguments[0];
            this.cb = arguments[1];
            this.hasTracked = false;
        },
        track: function(element, cb) {
            this.iframes.push(new this.Iframe(element, cb));
            if (!this.interval) {
                var _this = this;
                this.interval = setInterval(function() { _this.checkClick(); }, this.resolution);
            }
        },
        checkClick: function() {
            if (document.activeElement) {
                var activeElement = document.activeElement;
                for (var i in this.iframes) {
                    /*var eid=this.iframes[i].element.id;
                    if((eid) && !document.getElementById(eid)){
                        delete this.iframes[i];
                        continue;
                    }*/
                    if (activeElement === this.iframes[i].element) { // user is in this Iframe
                        if (this.iframes[i].hasTracked === false) {
                            this.iframes[i].cb.apply(window, []);
                            this.iframes[i].hasTracked = true;
                        }
                    } else {
                        this.iframes[i].hasTracked = false;
                    }
                }
            }
        }
    },
    _iframe_click_lock_children:{},
    _renderBar:function () {
      //调整任务栏项目的宽度
        if(this._countTask<=0){return;} //防止除以0
        var btns=$("#mos_btn_group_middle>.btn");
        btns.css('width',('calc('+(1/this._countTask*100)+'% - 1px )'))
    },
    _handleReady:[],
    _hideShortcut:function () {//隐藏桌面图标
        var that=$("#mos #mos-shortcuts .shortcut");
        that.removeClass('animated');//'animated flipInX'
        that.addClass('animated');//'animated flipOutX'
    },
    _showShortcut:function () {//显示桌面图标
        var that=$("#mos #mos-shortcuts .shortcut");
        that.removeClass('animated');
        that.addClass('animated');
    },
    _checkBgUrls:function () {
        var loaders=$('#mos>.img-loader');
        var flag=false;
        if(mos.isSmallScreen()){
                if(mos._bgs.mobile){
                    loaders.each(function () {
                        var loader=$(this);
                        if(loader.attr('src')===mos._bgs.mobile && loader.hasClass('loaded')){
                            mos._setBackgroundImg(mos._bgs.mobile);
                            flag=true;
                        }
                    });
                    /*if(!flag){
                        //没找到加载完毕的图片
                        var img=$('<img class="img-loader" src="'+mos._bgs.mobile+'" />');
                        $('#mos').append(img);
                        mos._onImgComplete(img[0],function () {
                            img.addClass('loaded');
                            mos._setBackgroundImg(mos._bgs.mobile);
                        })
                    }*/
                }
            }else{
                if(mos._bgs.main){
                    loaders.each(function () {
                        var loader=$(this);
                        if(loader.attr('src')===mos._bgs.main && loader.hasClass('loaded')){
                            mos._setBackgroundImg(mos._bgs.main);
                            flag=true;
                        }
                    });
                    /*if(!flag){
                        //没找到加载完毕的图片
                        var img=$('<img class="img-loader" src="'+mos._bgs.main+'" />');
                        $('#mos').append(img);
                        mos._onImgComplete(img[0],function () {
                            img.addClass('loaded');
                            mos._setBackgroundImg(mos._bgs.main);
                        })
                    }*/
                }
        }

    },
    _startAnimate:function () {//开始菜单磁贴动画
        setInterval(function () {
            var classes_lenth=mos._animated_classes.length;
            var animated_liveness=mos._animated_liveness;
            if(animated_liveness===0 || classes_lenth===0 || !$("#mos-menu").hasClass('opened')){return;}
            $('#mos-menu>.blocks>.menu_group>.block').each(function () {
                if(!$(this).hasClass('onAnimate') && Math.random()<=animated_liveness){
                    var that=$(this);
                    var class_animate = mos._animated_classes[Math.floor((Math.random()*classes_lenth))];
                    that.addClass('onAnimate');
                    setTimeout(function () {
                        that.addClass(class_animate);
                        setTimeout(function () {
                            that.removeClass('onAnimate');
                            that.removeClass(class_animate);
                        },3000);
                    },Math.random()*2*1000)
                }
            })
        },1000);
    },
    _onImgComplete:function (img, callback) {
        if(!img){return;}
        var timer = setInterval(function() {
            if (img.complete) {
                callback(img);
                clearInterval(timer);
            }
        }, 50)
    },
    _setBackgroundImg:function (img) {//设置背景图片
        $('#mos').css('background-image','url('+img+')');
    },
    _settop:function (moslayer) {//将窗口置于顶层
        if(!isNaN(moslayer)){
            moslayer=this.getmoslayerByIndex(moslayer);
        }
        var max_zindex=0;
        $(".mos-open-iframe").each(function () {
            z=parseInt($(this).css('z-index'));
            $(this).css('z-index',z-1);
            if(z>max_zindex){max_zindex=z;}
        });
        moslayer.css('z-index',max_zindex+1);
        $(".mlayer-title").removeClass("active");
        $(".mlayer-border").removeClass("active");
        moslayer.addClass("active");//活动窗口
        moslayer.find(".mlayer-title").addClass("active");//活动窗口
    },
    _checkTop:function () {
        var max_index=0,max_z=0,btn=null;
        $("#mos_btn_group_middle .btn.show").each(function () {
            var index=$(this).attr('index');
            var moslayer=mos.getmoslayerByIndex(index);
            var z=moslayer.css('z-index');
            if(z>max_z){
                max_index=index;
                max_z=z;
                btn=$(this);
            }
        });
        this._settop(max_index);
        $("#mos_btn_group_middle .btn").removeClass('active');
        if(btn){
            btn.addClass('active');
        }
    },
    _showtips:function(obj,index,type,content,position){//显示单个提示
        var tipsindex=index;
        if (type=="func"){
            var tipscontent=eval("("+content+")")();
        }
        if (type=="html"){
            var tipscontent=content;
        }
        $(obj).hover(function(e){
            tipsindex=layer.tips(tipscontent, this, {
                tips: [position, '#ffffff'] //还可配置颜色
            });
            
        });
        $(obj).mouseleave(function(){
            layer.close(tipsindex);
        });
    },
    _renderContextMenu:function (x,y,menu,trigger) {//右键菜单的html
        this._removeContextMenu();
        if(menu===true){return;}
        var dom = $("<div class='mos-context-menu'><ul></ul></div>");
        $('#mos').append(dom);
        var secondmenuNum=[];//二级菜单序号
        var secondmenuNums=0;//二级菜单数量
        var thirdmenuNum=[];//三级菜单序号
        var thirdmenuNums=0;//三级菜单总数量
        var thirdmenuNumsub=[];//三级菜单数量明细
        var ul=dom.find('ul');
        for(var i=0;i<menu.length;i++){
            var item=menu[i];
            if(item==='|'){
                ul.append($('<hr/>'));
                continue;
            }
            if(typeof(item)==='string'){
                ul.append($('<li>'+item+'</li>'));
                continue;
            }
            if(typeof(item)==='object'){
                if(item.length<3){
                    var sub=$('<li>'+item[0]+'</li>');
                    ul.append(sub);
                    sub.click(trigger,item[1]);
                    continue;
                }else{//有二级菜单
                    secondmenuNum.push(i);
                    secondmenuNums+=1;
                    var secondsub=$('<li id="secondmenu'+i+'">'+item[0]+'</li>');
                    ul.append(secondsub);
                    var seconddom=$("<ul></ul>");
                    $('#secondmenu'+i).append(seconddom);
                    var secondul=$('#secondmenu'+i).find('ul');
                    for (var j=1;j<item.length;j++){
                        var seconditem=item[j];   
                        if(seconditem=='|'){
                            secondul.append($('<hr/>'));
                            continue;
                        }
                        if(typeof(seconditem)=='string'){
                            secondul.append($('<li>'+seconditem+'</li>'));
                            continue; 
                        }
                        if(typeof(seconditem)=='object'){
                            if(seconditem.length<3){
                                var secondsub=$('<li>'+seconditem[0]+'</li>');
                                secondul.append(secondsub);
                                secondsub.click(trigger,seconditem[1]);
                                continue;
                            }else{//有三级菜单
                                thirdmenuNum.push(""+i+j);
                                thirdmenuNums+=1;
                                thirdmenuNumsub.push(seconditem.length);
                                var thirdsub=$('<li id="thirdmenu'+i+j+'">'+seconditem[0]+'</li>');
                                secondul.append(thirdsub);
                                var thirddom=$("<ul></ul>");
                                $('#thirdmenu'+i+j).append(thirddom);
                                var thirdul=$('#thirdmenu'+i+j).find('ul');
                                for (var k=1;k<seconditem.length;k++){
                                    var thirditem=seconditem[k];
                                    if(thirditem=='|'){
                                        thirdul.append($('<hr/>'));
                                        continue;
                                    }
                                    if(typeof(thirditem)=='string'){
                                        thirdul.append($('<li>'+thirditem+'</li>'));
                                        continue; 
                                    }
                                    if(typeof(thirditem)=='object'){
                                        var thirdsub=$('<li>'+thirditem[0]+'</li>');
                                        thirdul.append(thirdsub);
                                        thirdsub.click(trigger,thirditem[1]);
                                        continue;
                                    }
                                }
                                continue;
                            }
                        }  
                    }
                    continue;
                }               
            }
        }
        //一级菜单修正坐标
        if(x+150>document.body.clientWidth){x-=150}
        if(y+dom.height()>document.body.clientHeight){y-=dom.height()}
        dom.css({
            top:y,
            left:x,
        });
        //二级菜单修正坐标
        if (secondmenuNum.length>0){
            for(var i=0;i<secondmenuNum.length;i++){
                //鼠标移入
                $("#secondmenu"+secondmenuNum[i]).on('mouseover', function (){
                    $(this).children("ul")[0].style.display="block";
                    var secondX=dom.offset().left+$(this).children("ul")[0].clientWidth;
                    var secondY=$(this).offset().top;
                    if (secondX+$(this).children("ul")[0].clientWidth>document.body.clientWidth){secondX-=$(this).children("ul")[0].clientWidth+dom.width()}
                    if (secondY+$(this).children("ul")[0].clientHeight>document.body.clientHeight){secondY-=$(this).children("ul")[0].clientHeight-$(this)[0].clientHeight}
                    $(this).children("ul").css({
                        top:secondY,
                        left:secondX
                    });
                });
                $("#secondmenu"+secondmenuNum[i]).on('mouseout', function (){
                    $(this).children("ul")[0].style.display="none";
                });
            }
        }
        //三级菜单修正坐标
        if(thirdmenuNum.length>0){
            for(var i=0;i<thirdmenuNum.length;i++){
                $("#thirdmenu"+thirdmenuNum[i]).on('click',function(){

                });
                //鼠标移入
                var ulheight=30*Number(thirdmenuNumsub[i]-1);
                $("#thirdmenu"+thirdmenuNum[i]).on('mouseover', function (){
                    $(this).children("ul")[0].style.display="block";
                    var thirdX=parseFloat($(this).parent("ul")[0].style.left.replace("px",""))+150;
                    var thirdY=parseFloat($(this).parent("ul")[0].style.top.replace("px",""))+30*Number($(this).index());
                    if (thirdX+150>document.body.clientWidth){thirdX-=300}
                    if (thirdY+ulheight>document.body.clientHeight){thirdY-=ulheight-30}
                    $(this).children("ul").css({
                        top:thirdY,
                        left:thirdX
                    });
                });
                $("#thirdmenu"+thirdmenuNum[i]).on('mouseout', function (){
                    $(this).children("ul")[0].style.display="none";
                });
            }
        }
    },
    _removeContextMenu:function () {
        $('.mos-context-menu').remove();
    },
    _closeWin:function (index) {//关闭窗口
        $("#mos_" + index).remove();
        layer.close(index);
        delete mos._windows["mlayer-iframe"+index];
        mos._checkTop();
        mos._countTask--;//回退countTask数
        mos._renderBar();
    },
    _fixWindowsHeightAndWidth:function(){
        //此处代码修正全屏切换引起的子窗体尺寸超出屏幕
        var opens=$('.mos-open-iframe');
        var clientHeight=document.body.clientHeight;
        opens.each(function () {
            var moslayer_opened=$(this);
            var height=moslayer_opened.css('height');
            height=parseInt(height.replace('px',''));
            if (height+40>=clientHeight){
                moslayer_opened.css('height',clientHeight-40);
                moslayer_opened.find('.mlayer-content').css('height',clientHeight-83);
                moslayer_opened.find('.mlayer-content iframe').css('height',clientHeight-83);
            }
        })
    },

    /**
     * 说明: 所有#mos下的元素加入类mos-open-window即可自动绑定openUrl函数，无须用onclick手动绑定
     */
    _bind_open_windows:function () {
        // 注册事件委派 打开url窗口
        $('#mos').on('click', '.mos-open-window', function() {
            //>> 获取当前点击的对象
            $this = $(this);
            //>> 判断url地址是否为空 如果为空 不予处理
            if($this.data('url') !== "") {
                //>> 获取弹窗标题
                var title = $this.data('title')||'',
                    areaAndOffset;
                //>> 判断是否有标题图片
                var bg=$this.data('icon-bg')?$this.data('icon-bg'):'';
                if($this.data('icon-image')) {
                    //>> 加入到标题中
                    title = '<img class="icon '+bg+'" src="' + $this.data('icon-image') + '"/>' + title;
                }
                if($this.data('icon-font')) {
                    //>> 加入到标题中
                    title = '<i class="fa fa-fw fa-'+$this.data('icon-font')+' icon '+bg+'"></i>' + title;
                }
                if(!title && $this.children('.icon').length===1 && $this.children('.title').length===1){
                    title = $this.children('.icon').prop("outerHTML")+$this.children('.title').html();
                }
                //>> 判断是否需要 设置 区域宽度高度
                if($this.data('area-offset')) {
                    areaAndOffset = $this.data('area-offset');
                    //>> 判断是否有分隔符
                    if(areaAndOffset.indexOf(',')!==-1){
                        areaAndOffset = eval(areaAndOffset);
                    }
                }
                //>> 调用mos打开url方法
                mos.openUrl($this.data('url'), title, areaAndOffset);
            }
        })
    },
    _init:function () {
        document.oncontextmenu=new Function("event.returnValue=false;");//屏蔽右键
        //document.onselectstart=new Function("event.returnValue=false;");//屏蔽选择内容
        mos._dynamicwallpaperid="dynamicwallpaper";
        mos._RootPath=window.document.location.href;//网站根目录;
        document.title=mos._title+"-"+mos._version;
        mos._screenheight=$(window).height();//浏览器当前窗口可视区域高度
        mos._screenwidth=$(window).width();//浏览器当前窗口可视区域宽度
        //读取用户名
        var username=mos.getcookie("mos_user_id");
        mos._username=username;//将变量传给系统以便子页面调用
        //设置各数据库
        var userDataSet=mos.getuserinfo(username);//当前用户数据库
        mos._AlluserDataSet=mos.getAlluserinfo();//所有用户数据库
        mos._userDataSet=userDataSet;
        //鼠标点击文档任何地方时
        $(document).on('click',function(e){
            $(".shortcut").removeClass("shortcut-focus");//取消桌面图标的选定状态
            if(!e.button)  mos._removeContextMenu();//点击清空右键菜单
        });
        //获取用户设置
        mos._usersetupDataSet=mos.getsetup(username);
        //获取用户右键菜单数据
        mos._userCmenuDataSet=mos.getcmenu(username);
        //获取当前用户的桌面数据库
        var desktopDataSet=mos.getdesktopdata(username);
        mos._userdesktopDataSet=desktopDataSet;
         //设置壁纸
         mos.setBg();
        //设置桌面图标
        mos.setdesktop();
        //设置左边条列表
        mos.setslide();
        //设置左边条
        mos.setsideleft();
        //设置任务栏左边按钮
        mos.settaskbarleft();
        //设置任务栏右边按钮
        mos.settaskbarright();
        //获取语言
        this._lang=(navigator.language || navigator.browserLanguage).toLowerCase();
        $("#mos_btn_win").click(function () {
            mos.commandCenterClose();
            mos.menuToggle();
        });
        $("#mos .desktop").click(function () {
            mos.menuClose();
            mos.commandCenterClose();
            $(".morerightbtn")[0].style.display = "none";
        });
        $('#mos_btn_command_center_clean_all').click(function () {//消息中心-全部清除消息
            var msgs=$('#mos_command_center .msg');
            msgs.addClass('animated slideOutRight');
            setTimeout(function () {
                msgs.remove()
            }, 1500);
            setTimeout(function () {
                mos.commandCenterClose();
            }, 1000);
        });
        $("#mos-menu-switcher").click(function () {
            if(mos._switchMenuTooHurry){return;}
            mos._switchMenuTooHurry=true;
            var class_name='mos-menu-hidden';
            var list=$("#mos-menu>.list");
            var blocks=$("#mos-menu>.blocks");
            var toggleSlide=function (obj) {
                if(obj.hasClass(class_name)){
                    obj.addClass('animated slideInLeft');
                    obj.removeClass('animated slideOutLeft');
                    obj.removeClass(class_name);
                }else{
                    setTimeout(function () {
                        obj.addClass(class_name);
                    },450);
                    obj.addClass('animated slideOutLeft');
                    obj.removeClass('animated slideInLeft');
                }
            };
            toggleSlide(list);
            toggleSlide(blocks);
            setTimeout(function () {
                mos._switchMenuTooHurry=false;
            },520)
        });
        $("#mos_btn_group_middle").click(function () {
            $("#mos .desktop").click();
        });
        $(document).on('click', '.mos-btn-refresh', function () {//刷新子页面
            var index = $(this).attr('index');
            var iframe = mos.getmoslayerByIndex(index).find('iframe');
            iframe.attr('src', iframe.attr('src'));
        });
        /*$(document).on('click', '.mos-btn-change-url', function () {
            var index = $(this).attr('index');
            var iframe = mos.getmoslayerByIndex(index).find('iframe');
            layer.prompt({
                title: mos.lang('编辑网址','Edit URL'),
                formType: 2,
                skin:'mos-layer-open-browser',
                value: iframe.attr('src'),
                area: ['500px', '200px'],
                zIndex:99999999999
            }, function (value, i) {
                layer.close(i);
                layer.msg(mos.lang('请稍候...','Hold on please...'),{time:1500},function () {
                    iframe.attr('src', value);
                });
            });
        });*/
        $(document).on('mousedown','.mos-open-iframe',function () {
            var moslayer=$(this);
            mos._settop(moslayer);
            mos._checkTop();
        });
        /*$('#mos_btn_group_middle').on('click','.btn_close',function () {
            var index = $(this).parent().attr('index') ;
            mos._closeWin(index);
        });*/
        $('#mos-menu .list').on('click','.item',function () {
            var e=$(this);
            if(e.hasClass('has-sub-down')){
                $('#mos-menu .list .item.has-sub-up').toggleClass('has-sub-down').toggleClass('has-sub-up');
                $("#mos-menu .list .sub-item").slideUp();
            }
            if(e.next().hasClass('sub-item')){
                e.toggleClass('has-sub-down').toggleClass('has-sub-up');
            }
            while (e.next().hasClass('sub-item')){
                e.next().slideToggle();
                e=e.next();
            }
        });

        /*$("#mos-browser").click(function () {//浏览器
            // var area = ['100%', (document.body.clientHeight - 40) + 'px'];
            // var offset = ['0', '0'];
            layer.prompt({
                title: mos.lang('访问网址','Visit URL'),
                formType: 2,
                value: '',
                skin:'mos-layer-open-browser',
                area: ['300px', '150px'],
                zIndex:99999999999
            }, function (value, i) {
                layer.close(i);
                layer.msg(mos.lang('请稍候...','Hold on please...'),{time:1500},function () {
                    mos.openUrl(value,value,"","");
                });
            });
        });*/
        //刷新离开前
        /*document.body.onbeforeunload = function(event){
            var rel = mos.lang( '系统可能不会保存您所做的更改','The system may not save the changes you have made.');
            if(!window.event){
                event.returnValue=rel;
            }else{
                window.event.returnValue=rel;
            }
        };*/
        
        mos._startAnimate();//开始菜单磁贴动画
        mos.renderShortcuts(desktopDataSet["others"]);//渲染图标
        //$("#mos-shortcuts").removeClass('shortcuts-hidden');//显示图标
        mos._showShortcut();//显示图标
        mos.setdesktopshortcut();//设置图标-根据图标属性
        //窗口改大小，重新渲染
        $(window).resize(function() {
            mos.renderShortcuts(desktopDataSet["others"]);
            /*mos._checkBgUrls();*/
            if(!mos.isSmallScreen()) mos._fixWindowsHeightAndWidth();
        });
        //浏览器细节
        /*$(document).on('focus',".mos-layer-open-browser textarea",function () {
            $(this).attr('spellcheck','false');
        });
        $(document).on('keyup',".mos-layer-open-browser textarea",function (e) {//浏览器文本按键
            if(e.keyCode===13){//回车键
                $(this).parent().parent().find('.mlayer-btn0').click();
            }
        });*/
        //禁用右键的右键
        $(document).on('contextmenu','.mos-context-menu',function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        //启用右键菜单
        mos.setContextMenu("#mos",true);
        mos.setContextMenuByuserName(username);
        //处理消息图标闪烁
        /*setInterval(function () {
            var btn=$("#mos-msg-nof.on-new-msg");
            if(btn.length>0){
                btn.toggleClass('fa-commenting-o');
            }
        },500);*/
        //绑定快捷键
        $("body").keyup(function (e) {
            if (e.ctrlKey)
            {
                switch (e.keyCode){
                    case 37://left
                        $("#mos_btn_win").click();
                        break;
                    case 38://up
                        mos.showWins();
                        break;
                    case 39://right
                        $("#mos_btn_command").click();
                        break;
                    case 40://down
                        mos.hideWins();
                        break;
                }
            }
        });
        if($("#mos-desktop-scene").length<1) {
            $("#mos-shortcuts").css({
                position: 'absolute',
                left: 0,
                top: 0,
                'z-index': 100,
            });
            $("#mos .desktop").append("<div id='mos-desktop-scene' style='width: 100%;height: calc(100% - 40px);position: absolute;left: 0;top: 0; z-index: 0;background-color: transparent;'></div>")
        }
        $(document).on('click','#mos-menu .blocks .menu_group .title',function(){//磁贴标题点击-绑定点击事件这样写
            var titleindex=$(this).attr("index");
            var oldtitle=$(this)[0].textContent;
            if (oldtitle==""){oldtitle="默认应用";}
            var that=this;
            var input='<input type="text" name="blocktitle" value="'+oldtitle+'" style="width:250px;">';
            $(this).html(input);
            $('input[name="blocktitle"]').focus().select();
            $('input[name="blocktitle"]').on("blur",function(){
                var newtitle=$(this).val();
                if(newtitle=="") {newtitle=oldtitle;}
                $(that).html(newtitle);
                desktopDataSet["blocks"][titleindex]["title"]=newtitle;
                mos.savedesktop(username,desktopDataSet);//实时保存 
            });
        });
        //动画
        mos.setAnimated([
            'animated flip',
            'animated bounceIn',
        ], 0.01);
        //属性绑定
        mos._bind_open_windows();
        //获取skin文件
        $("#skin")[0].href=mos._RootPath+"core/css/"+mos._usersetupDataSet["personal"]["items"][1]["item"]["colorattribute"][Number(mos._usersetupDataSet["personal"]["items"][1]["item"]["colorindex"])]["name"]+".css";
        //设置任务栏属性
        mos.settaskbar();
        //启用屏保
        mos.lockscreen(mos._usersetupDataSet["personal"]["items"][2]["item"]);
    },
    getAlluserinfo:function () {//获取所有用户信息
        var userdb=[];
        $.ajaxSettings.async = false;
        $.getJSON(mos._RootPath+"data/system/user.json",function(data){    
            userdb=data["data"];
        });
        $.ajaxSettings.async = true;
        return userdb;
    },
    getuserinfo:function (username) {//获取特定用户信息
        var userdb=[];
        $.ajaxSettings.async = false;
        $.getJSON(mos._RootPath+"data/system/user.json",function(data){    
            for (var i=0;i<data["data"].length;i++){
                if (data["data"][i]["loginname"]==username){
                    userdb=data["data"][i];
                    break;
                }
            }
        });
        $.ajaxSettings.async = true;
        return userdb;
    },
    setBgUrl:function (bgs) {//设置背景
        this._bgs=bgs;
        if(mos.isSmallScreen()){
            $("#mos").attr("style","background-repeat:no-repeat;background-image:url("+bgs["mobile"]+")");
        }else{
            $("#mos").attr("style","background-repeat:no-repeat;background-image:url("+bgs["main"]+")");
        }
        /*this._checkBgUrls();*/
    },
    menuClose: function () {//关闭菜单
        $("#mos-menu").removeClass('opened');
        $("#mos-menu").addClass('hidden');
        $("#mos-menu").css({height:"70%"});//高度复原
        this._showShortcut();
        $(".mos-open-iframe").removeClass('hide');
    },
    menuOpen: function () {//菜单打开时
        //设置磁贴
        mos.setblock();
        $("#mos-menu").removeClass('hidden');
        $("#mos-menu").addClass('opened');
        $("#mos-menu").animate({height:"80%"},300);//弹出动画animate(styles,speed,easing,callback)
        $("#mos-menu .sideleft").removeClass("open");
        $("#mos-menu .list .listcover").hide();
        //this._hideShortcut();//隐藏桌面图标
        //$(".mos-open-iframe").addClass('hide');//隐藏所有已打开的窗口
    },
    menuToggle: function () {//菜单切换
        if(!$("#mos-menu").hasClass('opened')){
            this.menuOpen();
        }else{
            this.menuClose();
        }
    },
    commandCenterClose: function () {//消息中心关闭
        $("#mos_command_center").addClass('hidden_right');
        this._showShortcut();
        $(".mos-open-iframe").removeClass('hide');
    },
    commandCenterOpen: function () {//消息中心打开时
        //系统消息中心
        mos.newMsg(mos._username);
        $("#mos_command_center").removeClass('hidden_right');
        //this._hideShortcut();//隐藏桌面图标
        //$(".mos-open-iframe").addClass('hide');//隐藏所有已打开的窗口
        //$("#mos-msg-nof").removeClass('on-new-msg fa-commenting-o');
    },
    renderShortcuts:function (iconDataSet) {//渲染桌面图标
        var h=parseInt($("#mos #mos-shortcuts")[0].offsetHeight/100);
        var x=0,y=0;
        if(iconDataSet["bicon"]=="true"){
            var offsetleft=120;
            var offsettop=120;
            $("#mos #mos-shortcuts .shortcut>.icon").css({"width":"80px","height":"80px"});
            $("#mos #mos-shortcuts .shortcut").css({"width":"106px"});
        }
        if(iconDataSet["micon"]=="true"){
            var offsetleft=90;
            var offsettop=90;
            $("#mos #mos-shortcuts .shortcut>.icon").css({"width":"50px","height":"50px"});
            $("#mos #mos-shortcuts .shortcut").css({"width":"78px"});
        }
        if(iconDataSet["sicon"]=="true"){
            var offsetleft=78;
            var offsettop=78;
            $("#mos #mos-shortcuts .shortcut>.icon").css({"width":"38px","height":"38px"});
            $("#mos #mos-shortcuts .shortcut").css({"width":"64px"});
        }
        $("#mos #mos-shortcuts .shortcut").each(function () {
            $(this).css({
                left:x*offsetleft,
                top:y*offsettop,
            });
            y++;
            if(y>=h){
                y=0;
                x++;
            }
        });
    },
    renderMenuBlocks:function () {//渲染菜单磁贴
        var cell_width=44;
        var groups=$("#mos-menu .menu_group");
        groups.each(function () {
            var group=$(this);
            var blocks=group.children('.block');
            var max_height=0;
            blocks.each(function () {
                var that=$(this);
                var loc=that.attr('loc').split(',');
                var size=that.attr('size').split(',');
                var top=(loc[1]-1)*cell_width+40;
                var height=size[1]*cell_width;
                var full_height=top+height;
                if (full_height>max_height){max_height=full_height}
                that.css({
                    top:top,
                    left:(loc[0]-1)*cell_width,
                    width:size[0]*cell_width,
                    height:height,
                })

            });
            group.css('height',max_height);//设置磁贴群组的高度
        });
    },
    commandCenterToggle: function () {//消息中心切换
        if($("#mos_command_center").hasClass('hidden_right')){
            this.commandCenterOpen();
        }else{
            this.commandCenterClose();
        }
    },
    getcookie:function(name){//获取cookie
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
        else
        return null;
    },
    getsetup:function(username){//获取用户设置
        var setupurl=mos._RootPath+"data/user/"+username+"/setup.json";
        var setupDataSet=[];
        $.ajaxSettings.async = false;
        if(mos.netfileexist(setupurl)){
            $.getJSON(setupurl+"?ran="+Math.random(),function(data){//读取基本提示数据库文件
                setupDataSet=data;
            });
        }
        $.ajaxSettings.async = true;
        return setupDataSet;
    },
    getcmenu:function(username){//获取用户右键菜单数据
        //获取用户右键菜单url
        var usercmUrl=mos._RootPath+"data/user/"+username+"/cmenu.json";
        //读取用户右键菜单数据
        var usercmdata=[];//基本数据库
        $.ajaxSettings.async = false;
        if(mos.netfileexist(usercmUrl)){
            $.getJSON(usercmUrl+"?ran="+Math.random(),function(data){//读取用户提示数据库文件
                usercmdata=data['data'];
            });
        }
        $.ajaxSettings.async = true;
        return usercmdata;
    },
    getdesktopdata:function(username){//获取用户桌面信息
        //获取桌面信息url
        var shortcutsUrl=mos._RootPath+"data/user/"+username+"/desktop.json";
        //读取桌面信息数据
        var desktopDataSet=[];//桌面信息数据库
        $.ajaxSettings.async = false;
        if(mos.netfileexist(shortcutsUrl)){
            $.getJSON(shortcutsUrl+"?ran="+Math.random(),function(data){//读取基本提示数据库文件
                desktopDataSet=data;
            });
        }
        $.ajaxSettings.async = true;
        return desktopDataSet;
    },
    getbMsg:function(){//获取基本消息
        var baseMsgDataSet=[];//基本消息数据库
        //获取消息中心的url
        var baseMsgUrl=mos._RootPath+"data/system/messages.json";
        $.ajaxSettings.async = false;
        if(mos.netfileexist(baseMsgUrl)){
            $.getJSON(baseMsgUrl+"?ran="+Math.random(),function(data){//读取基本消息数据库文件
                baseMsgDataSet=data['data'];
            });
        }
        $.ajaxSettings.async = true;
        return baseMsgDataSet;
    },
    getuMsg:function(username){//获取用户消息
        var userMsgDataSet=[];//用户消息数据库
        //获取消息中心的url
        var userMsgUrl=mos._RootPath+"data/user/"+username+"/messages.json";
        $.ajaxSettings.async = false;
        if(mos.netfileexist(userMsgUrl)){
            $.getJSON(userMsgUrl+"?ran="+Math.random(),function(data){//读取用户消息数据库文件
                userMsgDataSet=data['data'];
            });
        }
        $.ajaxSettings.async = true;
        return userMsgDataSet;
    },
    newMsg: function (username) {//发布新消息到消息中心并提示
        var baseMsgDataSet=mos.getbMsg();//基本消息数据库
        var userMsgDataSet=mos.getuMsg(username);//用户消息数据库
        $("#mos_command_center .msgs").empty();
        if(baseMsgDataSet.length>0){//基本消息操作
            var bclickfunc=[];
            for(var i=0;i<baseMsgDataSet.length;i++){
                if(!baseMsgDataSet[i]["readedusers"].in_array(username)){
                    var e = '<div class="msg" msgtype="bMsg" msgindex='+i+'>' +
                    '<div class="title">' + baseMsgDataSet[i]["title"] +'</div>'+
                    '<div class="content">' + baseMsgDataSet[i]["content"] + '</div>' +
                    '<span class="btn_close_msg fa fa-close"></span>' +
                    '</div>';
                    bclickfunc[i]=baseMsgDataSet[i]["func"];
                    $("#mos_command_center .msgs").append(e);
                }  
            }            
        }
        if(userMsgDataSet.length>0){//用户消息操作
            var uclickfunc=[];
            for(var i=0;i<userMsgDataSet.length;i++){
                if(!baseMsgDataSet[i]["readedusers"].in_array(username)){
                    var e = '<div class="msg" msgtype="uMsg" msgindex='+i+'>' +
                    '<div class="title">' + userMsgDataSet[i]["title"] +'</div>'+
                    '<div class="content">' + userMsgDataSet[i]["content"] + '</div>' +
                    '<span class="btn_close_msg fa fa-close"></span>' +
                    '</div>';
                    uclickfunc[i]=userMsgDataSet[i]["func"];
                    $("#mos_command_center .msgs").append(e);
                }  
            } 
        }
        $("#mos_command_center .msgs .msg .title,#mos_command_center .msgs .msg .content").click(function(){
            if($(this).parent().attr("msgtype")==="bMsg"){
                eval(bclickfunc[$(this).parent().attr("msgindex")]);//执行脚本
                baseMsgDataSet[$(this).parent().attr("msgindex")]["readedusers"].push(username);
                mos.savebasemsg(baseMsgDataSet);
                var msg = $(this).parent();
                $(msg).addClass('animated slideOutRight');
                setTimeout(function () {
                    msg.remove()
                }, 500);
            }
            if($(this).parent().attr("msgtype")==="uMsg"){
                eval(uclickfunc[$(this).parent().attr("msgindex")]);//执行脚本
                userMsgDataSet[$(this).parent().attr("msgindex")]["readedusers"].push(username);
                mos.saveusermsg(username,userMsgDataSet);
                var msg = $(this).parent();
                $(msg).addClass('animated slideOutRight');
                setTimeout(function () {
                    msg.remove()
                }, 500);
            }
        });
        $('#mos').on('click',".msg .btn_close_msg", function () {
            if($(this).parent().attr("msgtype")==="bMsg"){
                baseMsgDataSet[$(this).parent().attr("msgindex")]["readedusers"].push(username);
                mos.savebasemsg(baseMsgDataSet);
            }
            if($(this).parent().attr("msgtype")==="uMsg"){
                userMsgDataSet[$(this).parent().attr("msgindex")]["readedusers"].push(username);
                mos.saveusermsg(username,userMsgDataSet);
            }
            var msg = $(this).parent();
            $(msg).addClass('animated slideOutRight');
            setTimeout(function () {
                msg.remove()
            }, 500);

        });
        /*layer.tips(mos.lang('新消息:','New message:')+title, '#mos_btn_command', {
            tips: [1, '#3c6a4a'],
            tipsMore: true,
            time: 2000
        });*/
        /*if($("#mos_command_center").hasClass('hidden_right')){
            $("#mos-msg-nof").addClass('on-new-msg');
        }*/
        
    },
    getmoslayerByIndex: function (index) {//通过索引,获得layer对象
        return $('#' + 'mlayer' + index)
    },
    getQueryString:function(url,key){//获取url地址中的参数-getQueryString(url,"参数名1") 
        var arr = [],obj = {};  
        if(key){  
            url.replace(new RegExp("[&?]"+ key + "=([^&#]*)","ig"), function(a,b) {  
                arr.push(b);
            });
        return arr.join(",");
        }else{  
            url.replace(/[?&]([^&#]+)=([^&#]*)/g, function(a,b,c){  
                obj[b]=c;
            });
            return obj;  
        } 
    },
    isSmallScreen: function (size) {//手机屏
        if (!size) {
            size = 768
        }
        var width = document.body.clientWidth;
        return width < size;
    },
    enableFullScreen: function () {//启动全屏
        //W3C
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
        //FireFox
        else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        }
        //Chrome等
        else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen();
        }
        //IE11
        else if (document.documentElement.msRequestFullscreen) {
            document.body.msRequestFullscreen();
        }
    },
    disableFullScreen: function () {//退出全屏
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    },
    lockscreen:function (lockscreenDataSet) {//锁屏-鼠标键盘无动作时
        if(lockscreenDataSet["lock"]=="true"){
            var count = 0;
            var nTimeout = Number(lockscreenDataSet["locktime"]);//分钟
            var lockscreentimeout = function() {//超时处理-锁屏-屏保
                count++;
                if(count==nTimeout*60){
                    var lockscreenindex=layer.open({
                        title:false,
                        type: 2,
                        closeBtn: 0,
                        area: ['100%', '100%'],
                        content: [mos._RootPath+'template/lockscreen.php','no'] //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://com', 'no']
                    });
                    mos._lockscreenindex=lockscreenindex;
                    $("#mlayer"+lockscreenindex)[0].style.zIndex=19751102;
                    $("#mlayer-shade"+lockscreenindex)[0].style.zIndex=19751102;
                }
            }; 
            mos._lockscreenTimer=setInterval(lockscreentimeout, 1000);
            var x,y;
            var lockscreensignalmouse = function(event) {//监听鼠标
                var x1 = event.clientX;
                var y1 = event.clientY;
                if (x != x1 || y != y1) {
                    count = 0;
                }
                x = x1;
                y = y1;
            };
            var lockscreensignalkey = function() {//监听键盘
                count = 0;
            };
            document.body.onmousemove = lockscreensignalmouse; 
            document.body.onmousedown = lockscreensignalmouse;
            document.body.onkeydown = lockscreensignalkey;
            document.body.onkeypress = lockscreensignalkey;
        }
    },
    setBg:function(){//设置桌面壁纸
        var wallpaperData=mos._userdesktopDataSet["wallpapers"];
        switch(wallpaperData["bgmodel"]){
            case "slide"://幻灯片模式
                $("#"+mos._dynamicwallpaperid).remove();
                $("#mos-desktop-scene").empty();
                $.post(mos._RootPath+"core/func/interactive.php",{"bgfilepath":'../../'+wallpaperData["slideurl"]},function(data){
                    var filenamelist=$.parseJSON(data);
                    var randomBgIndex = Math.round( Math.random()*Number(filenamelist.length-1));
                    mos.setBgUrl({
                        main:mos._RootPath+wallpaperData["slideurl"]+"/"+filenamelist[randomBgIndex],
                        mobile:mos._RootPath+wallpaperData["slideurl"]+"/"+filenamelist[randomBgIndex]
                    });
                    $('#mos').css('background-repeat',wallpaperData["picmodel"]);
                    mos._slideTimer=setInterval(function(){//定时执行
                        var srandomBgIndex = Math.round( Math.random()*Number(filenamelist.length-1));
                        mos.setBgUrl({
                            main:mos._RootPath+wallpaperData["slideurl"]+"/"+filenamelist[srandomBgIndex],
                            mobile:mos._RootPath+wallpaperData["slideurl"]+"/"+filenamelist[srandomBgIndex]
                        });
                        $('#mos').css('background-repeat',wallpaperData["picmodel"]);
                    },Number(wallpaperData["autotime"]));
                });
            break;
            case "pic"://图片
                $("#"+mos._dynamicwallpaperid).remove();
                $("#mos-desktop-scene").empty();
                window.clearInterval(mos._slideTimer);//清除幻灯定时器
                mos._slideTimer=null;//清除幻灯定时器
                mos.setBgUrl({
                    main:mos._RootPath+wallpaperData["wallpaper"]["pc"],
                    mobile:mos._RootPath+wallpaperData["wallpaper"]["mobile"]
                });
                $('#mos').css('background-repeat',wallpaperData["picmodel"]);
            break;
            case "pcolor"://纯色
                $("#"+mos._dynamicwallpaperid).remove();
                $("#mos-desktop-scene").empty();
                window.clearInterval(mos._slideTimer);//清除幻灯定时器
                mos._slideTimer=null;//清除幻灯定时器
                $("#mos").css({"background-color":wallpaperData["colorpool"][Number(wallpaperData["colorindex"])],"background-image":"url()"});
            break;
            case "dynamic"://动态
                $("#"+mos._dynamicwallpaperid).remove();
                $("#mos-desktop-scene").empty();
                window.clearInterval(mos._slideTimer);//清除幻灯定时器
                mos._slideTimer=null;//清除幻灯定时器
                var dynamicfile=mos._RootPath+"core/js/"+wallpaperData["dynamic"]["dynamicpool"][Number(wallpaperData["dynamic"]['index'])]["name"]+".js";
                mos.loaddynamic(mos._dynamicwallpaperid,dynamicfile);
            break;
        }
    },
    loaddynamic:function(id,dynamicfile){//动态加载js
        var scriptTag = document.getElementById( id ); 
        var oBody = document.getElementsByTagName('body').item(0); 
        var oscript= document.createElement("script"); 
        if (scriptTag) oBody.removeChild(scriptTag); 
        oscript.id = id; 
        oscript,type = "text/javascrīpt"; 
        oscript.src=dynamicfile ; 
        oBody.appendChild(oscript); 
    },
    settaskbarleft:function(){//设置任务栏左边按钮
        var groupleft=mos._userdesktopDataSet["groupleft"];
        if(groupleft.length>0){
            var grouplefthtml='';
            grouplefthtml+='<div id="mos_btn_win" class="btn"><span class="fa fa-windows"></span></div>';
            for(var i=0;i<groupleft.length;i++){
                if(mos._userdesktopDataSet["groupleft"][i]["show"]=="true"){
                    grouplefthtml+='<div id="'+mos._userdesktopDataSet["groupleft"][i]["id"]+'" class="'+mos._userdesktopDataSet["groupleft"][i]["class"]+'"';
                    if(mos._userdesktopDataSet["groupleft"][i]["tipstype"]=="system"){
                        grouplefthtml+=' title="'+mos._userdesktopDataSet["groupleft"][i]["tipscontent"]+'"';
                    }
                    grouplefthtml+=' style="'+mos._userdesktopDataSet["groupleft"][i]["style"]+'" onclick="'+mos._userdesktopDataSet["groupleft"][i]["func"]+'">'+mos._userdesktopDataSet["groupleft"][i]["iconhtml"]+'</div>';
                }
            }
            $("#mos_btn_group_left").empty().append(grouplefthtml);
        }
        mos.showAlltips([mos._userdesktopDataSet["groupleft"]]);//显示所有提示信息
    },
    settaskbarright:function(){//设置右边任务栏
        var groupright=mos._userdesktopDataSet["groupright"];
        var grouprightshownumber=Number(mos._userdesktopDataSet["grouprightshownumber"]);
        if(groupright.length>0){
            var grouprighthtml='';
            var grouprightmorebtnhtml='';
            for(var i=groupright.length-1;i>=0;i--){
                if(grouprightshownumber<=5 && mos._userdesktopDataSet["groupright"][i]["show"]=="true"){
                    if(i==5){continue;}
                    grouprighthtml+='<div id="'+mos._userdesktopDataSet["groupright"][i]["id"]+'" class="'+mos._userdesktopDataSet["groupright"][i]["class"]+'"';
                    if(mos._userdesktopDataSet["groupright"][i]["tipstype"]=="system"){
                        grouprighthtml+=' title="'+mos._userdesktopDataSet["groupright"][i]["tipscontent"]+'"';
                    }
                    grouprighthtml+=' style="'+mos._userdesktopDataSet["groupright"][i]["style"];
                    grouprighthtml+='" onclick="'+mos._userdesktopDataSet["groupright"][i]["func"]+'">'+mos._userdesktopDataSet["groupright"][i]["iconhtml"]+'</div>';
                }
                if(grouprightshownumber>5 && mos._userdesktopDataSet["groupright"][i]["show"]=="true"){
                    if(i>5){
                        grouprightmorebtnhtml+='<div id="'+mos._userdesktopDataSet["groupright"][i]["id"]+'" class="'+mos._userdesktopDataSet["groupright"][i]["class"]+'" style="width:35px;"';
                        if(mos._userdesktopDataSet["groupright"][i]["tipstype"]=="system"){
                            grouprightmorebtnhtml+=' title="'+mos._userdesktopDataSet["groupright"][i]["tipscontent"]+'"';
                        }
                        grouprightmorebtnhtml+=' style="'+mos._userdesktopDataSet["groupright"][i]["style"];
                        grouprightmorebtnhtml+='" onclick="'+mos._userdesktopDataSet["groupright"][i]["func"]+'">'+mos._userdesktopDataSet["groupright"][i]["iconhtml"]+'</div>';
                    }
                    if(i<=5){
                        grouprighthtml+='<div id="'+mos._userdesktopDataSet["groupright"][i]["id"]+'" class="'+mos._userdesktopDataSet["groupright"][i]["class"]+'"';
                        if(mos._userdesktopDataSet["groupright"][i]["tipstype"]=="system"){
                            grouprighthtml+=' title="'+mos._userdesktopDataSet["groupright"][i]["tipscontent"]+'"';
                        }
                        grouprighthtml+=' style="'+mos._userdesktopDataSet["groupright"][i]["style"];
                        mos._userdesktopDataSet["groupright"][i]["show"]=="true"?grouprighthtml+="":grouprighthtml+="display:none;";
                        grouprighthtml+='" onclick="'+mos._userdesktopDataSet["groupright"][i]["func"]+'">'+mos._userdesktopDataSet["groupright"][i]["iconhtml"]+'</div>';
                    }
                }
            }
            grouprighthtml+='<div id="mos_btn_show_desktop" class="btn"></div>';
            grouprighthtml+='<div class="morerightbtn"></div>';
            $("#mos_btn_group_right").empty().append(grouprighthtml);
            $(".morerightbtn").empty().append(grouprightmorebtnhtml);
            $(".morerightbtn")[0].style.display = "none";
        }
        $("#mos_btn_show_desktop").click(function () {//显示桌面-按钮
            $("#mos .desktop").click();
            mos.hideWins();
        });
        datetime();
        function datetime(){
            var myDate = new Date();
            var year=myDate.getFullYear();
            var month=myDate.getMonth()+1;
            var date=myDate.getDate();
            var hours=myDate.getHours();
            var mins=myDate.getMinutes();
            var seconds=myDate.getSeconds();
            if (mins<10){mins='0'+mins}
            $("#mos-taskbarclock").empty().append(hours+':'+mins+'<br/>'+year+'/'+month+'/'+date);
        }
        setInterval(function () {//设置时间格式-定时执行(可以传入参数)
            datetime();
        },1000);
        mos.showAlltips([mos._userdesktopDataSet["groupright"]]);//显示所有提示信息
    },
    showallappicon:function(){
        if($(".morerightbtn")[0].style.display=="none"){
            $(".morerightbtn")[0].style.display = "block";
            var ol=$("#mos_btn_group_right")[0].offsetLeft,ow=35*(Number(mos._userdesktopDataSet["grouprightshownumber"])-6)/2;
            $(".morerightbtn")[0].style.left=ol-ow-6+"px";
        }else{   
            $(".morerightbtn")[0].style.display = "none";
        }
    },
    settaskbar:function(){//设置任务栏属性
        var taskbarDataSet=mos._usersetupDataSet["personal"]["items"][1]["item"];
        if(taskbarDataSet["btmbartrans"]=="on"){
            if(taskbarDataSet["btmbarcolor"]=="on"){
                $("#mos_task_bar").removeClass().addClass("mostaskbar");
            }else{
                $("#mos_task_bar").removeClass().addClass("mostaskbar-ncolor");
            }  
        }else{
            if(taskbarDataSet["btmbarcolor"]=="on"){
                $("#mos_task_bar").removeClass().addClass("mostaskbar-non");
            }else{
                $("#mos_task_bar").removeClass().addClass("mostaskbar-ncolor");
            }  
        }
        if(taskbarDataSet["btmbarcolor"]=="on"){
            if(taskbarDataSet["btmbartrans"]=="on"){
                $("#mos_task_bar").removeClass().addClass("mostaskbar");
            }else{
                $("#mos_task_bar").removeClass().addClass("mostaskbar-non");
            }
        }else{
            $("#mos_task_bar").removeClass().addClass("mostaskbar-ncolor");
        }
    },
    setactivelayer:function(){//设置活动窗口
        var taskbarDataSet=mos._usersetupDataSet["personal"]["items"][1]["item"];
        if(taskbarDataSet["titlebarcolor"]=="off"){
            $(".mos-open-iframe .mlayer-title.active").css('background-color','#000');
            $(".mlayer-border.active").css('border','1px solid #000');}
    },
    setdesktop:function(){//设置用户桌面
        if(mos._userdesktopDataSet["others"]["byname"]=="true"){
            mos.sortJson(mos._userdesktopDataSet["shortcuts"],"title","asc");
        }
        if(mos._userdesktopDataSet["others"]["bysize"]=="true"){
            mos.sortJson(mos._userdesktopDataSet["shortcuts"],"size","asc");
        }
        if(mos._userdesktopDataSet["others"]["bystyle"]=="true"){
            mos.sortJson(mos._userdesktopDataSet["shortcuts"],"style","asc");
        }
        if(mos._userdesktopDataSet["others"]["bydate"]=="true"){
            mos.sortJson(mos._userdesktopDataSet["shortcuts"],"date","asc");
        }
        var shortcutsDataSet=mos._userdesktopDataSet["shortcuts"];
        if(shortcutsDataSet.length>0){
            var shortcutshtml="";
            for(var i=0;i<shortcutsDataSet.length;i++){
                if(shortcutsDataSet[i]["show"]=="true"){
                    shortcutshtml+='<div class="shortcut" id="'+shortcutsDataSet[i]["id"]+'" index="'+i+'" title="'+shortcutsDataSet[i]["tips"]+'"';
                    switch(shortcutsDataSet[i]["clickmode"]){
                        case "doubleclick":
                            shortcutshtml+=' ondblclick';
                        break;
                        case "click":
                            shortcutshtml+=' onclick';
                        break;
                    }
                    shortcutshtml+='="'+shortcutsDataSet[i]["func"]+'">';
                        shortcutshtml+='<img class="icon" src="'+mos._RootPath+shortcutsDataSet[i]["img"]+'"/>';
                        if(mos._usersetupDataSet["system"]["items"][2]["item"]["exticoshow"]){
                            if(shortcutsDataSet[i]["img1"]!==""){
                                shortcutshtml+='<img class="icon" style="position:absolute;top:0;left:13px;" src="'+mos._RootPath+shortcutsDataSet[i]["img1"]+'"/>';
                            }
                        }
                        shortcutshtml+='<div class="title">'+shortcutsDataSet[i]["title"]+'</div>';
                    shortcutshtml+='</div>';
                }
                
            }
            $("#mos-shortcuts").empty().append(shortcutshtml);
        }
        $("#mos-shortcuts .shortcut").click(function(e){
            $("#mos-shortcuts .shortcut").removeClass("shortcut-focus");  
            $(this).addClass("shortcut-focus");
            mos._removeContextMenu();//点击清空右键菜单
            e.stopPropagation();//阻止冒泡事件，即document的事件对.shortcut无效
        });
        var flag = true;
        var	first = 0;
        var second = 0;
        $(".shortcut .title").click(function(e){//图标文字单击
            var date = new Date();
            var one = date.getTime();
            if(flag){
                first = one;
                flag = false;
            } else {
                second = one;
                flag = true;
            }
            if(second > first){
                var end = second - first ;
                if(end > 499 && end < 1501){//图标文字两次单击在0.5秒到1.5秒之间时修改状态
                    var curindex=$(this).parent().attr("index");
                    var oldtext=$(this)[0].innerText;
                    if(oldtext==""){$(this)[0].innerText=shortcutsDataSet[Number(curindex)]["defaulttitle"];}
                    var that=this;
                    var input='<textarea name="shortcutstitle" autofocus style="text-align:center;font-size:12px;max-width:80px;">'+oldtext+'</textarea>';
                    $(this).html(input);
                    $('textarea[name="shortcutstitle"]').select();
                    $('textarea[name="shortcutstitle"]').on("blur",function(){
                        var newtext=$(this).val();
                        if(newtext=="") {newtext=oldtext;}
                        $(that).html(newtext);
                        shortcutsDataSet[Number(curindex)]["title"]=newtext;
                        mos.savedesktop(mos._username,mos._userdesktopDataSet);//实时保存 
                    });
                    $('textarea[name="shortcutstitle"]').dblclick(function(e){
                        e.stopPropagation();//阻止点击事件向上冒泡
                    });
                }
            }
        });

    },
    setdesktopshortcut:function(){
        if(mos._userdesktopDataSet["others"]["autosort"]=="true"){//自动排列
            $(".shortcut").mosdrag({scope:".desktop",pos:true,dragChange:true,changeMode:"sort"});
        }else{
            if(mos._userdesktopDataSet["others"]["grid"]=="true"){//图标对齐网格
                if(mos._userdesktopDataSet["others"]["bicon"]=="true"){//大图标
                    $(".shortcut").mosdrag({scope:".desktop",pos:false,dragChange:false,changeMode:"point",grid:[120,120]});
                }
                if(mos._userdesktopDataSet["others"]["micon"]=="true"){//中图标
                    $(".shortcut").mosdrag({scope:".desktop",pos:false,dragChange:false,changeMode:"point",grid:[90,90]});
                }
                if(mos._userdesktopDataSet["others"]["sicon"]=="true"){//小图标
                    $(".shortcut").mosdrag({scope:".desktop",pos:false,dragChange:false,changeMode:"point",grid:[78,78]});
                }
            }else{
                $(".shortcut").mosdrag({scope:".desktop",pos:false,dragChange:false,changeMode:"point"});
            }
        }
        
        if(mos._userdesktopDataSet["others"]["showdesktopicon"]=="true"){//显示桌面图标
            $("#mos-shortcuts").show();
        }else{
            $("#mos-shortcuts").hide();
        }
    },
    setsideleft:function(){//设置开始菜单左边条
        var sideleftDataSet=mos._userdesktopDataSet["sideleft"];
        if(sideleftDataSet.length>0){
            var sidelefthtml='';
            sidelefthtml+='<div id="mos-expandleft" class="btn" style="top:0;" title="展开">';
                sidelefthtml+='<i class="mosbtnicon"><i class="mosbtnicon mosbtnicon-expand" ></i></i><span class="btntext">开始</span>';
            sidelefthtml+='</div>';
            var shownum=0;
            for(var i=0;i<sideleftDataSet.length;i++){
                if(sideleftDataSet[i]["show"]=="true"){
                    sidelefthtml+='<div class="btn" style="bottom:'+shownum*48+'px;" title="'+sideleftDataSet[i]["title"]+'" ';
                        sideleftDataSet[i]["clicktype"]==""?sidelefthtml+='onclick="">':sidelefthtml+='onclick="'+sideleftDataSet[i]["func"]+'">';
                        sidelefthtml+='<i class="mosbtnicon"><i class="mosbtnicon '+sideleftDataSet[i]["iconimg"]+'" ></i></i><span class="btntext" style="font-size:12px;">'+sideleftDataSet[i]["name"]+'</span>';
                    sidelefthtml+='</div>';
                    shownum+=1;
                }
            }
            $("#mos-menu .sideleft").empty().append(sidelefthtml);
            $("#mos-expandleft").click(function(){
                if($("#mos-menu .sideleft").hasClass("open")){
                    $("#mos-menu .sideleft").removeClass("open");
                    $(this).attr("title","展开");
                }else{
                    $("#mos-menu .sideleft").addClass("open");
                    $(this).attr("title","");
                }
            });
        }
    },
    setslide:function(){
        $("#mos-menu .sideleft").removeClass("open");
        var slideDataSet=mos._userdesktopDataSet["menuslide"];
        if(mos._usersetupDataSet["personal"]["items"][4]["item"]["showapplist"]=="on"){
            if(slideDataSet.length>0){
                var slidehtml='<div class="listcover"></div>';
                var appDataSet=[];
                for(var i=0;i<slideDataSet.length;i++){
                    if(slideDataSet[i]["clicktype"]!==""){//选出可点击应用
                        appDataSet.push(slideDataSet[i]);
                    }
                }
                if(mos._usersetupDataSet["personal"]["items"][4]["item"]["shownearestapp"]=="on"){//最近添加的应用
                    mos.sortJson(appDataSet,"addtime","desc");//按添加时间排序-从大到小
                    slidehtml+='<div class="nearestapp">';//-nearestapp
                        slidehtml+='<div class="item listsort" ><span class="listsorttext" style="vertical-align:bottom;line-height: 24px;">最近添加</span></div>';
                    var nearestappnum=0;
                        slidehtml+='<div class="nearestapplist up">';//-nearestapplist
                    appDataSet.length>10?nearestappnum=10:nearestappnum=appDataSet.length;
                    for(var i=0;i<nearestappnum;i++){
                            slidehtml+='<div class="item" title="'+appDataSet[i]["tips"]+'" ';
                        appDataSet[i]["clicktype"]==""?slidehtml+='onclick="">':slidehtml+='onclick="'+appDataSet[i]["func"]+'">';
                        switch(appDataSet[i]["icontype"]){
                            case "img":
                                slidehtml+='<img class="icon start-item-icon" src="'+mos._RootPath+appDataSet[i]["icon"]+'"/>';
                            break;
                            case "iconfont":
                                slidehtml+=appDataSet[i]["icon"];
                            break;
                        }
                            slidehtml+=appDataSet[i]["title"]+'</div>';
                    }
                        slidehtml+='</div>';//-nearestapplist
                        slidehtml+='<div class="item nearestapplistexpand"><span class="nearestapplistexpandtext">展开</span><i class="nearestapplistexpandicon fa fa-angle-down" style="padding-left:5px;"></i></div>';
                    slidehtml+='</div>';//-nearestapp
                }
                if(mos._usersetupDataSet["personal"]["items"][4]["item"]["showfusedapp"]=="on"){//最常用的应用
                    mos.sortJson(appDataSet,"clicktimes","desc");//按添加时间排序-从大到小
                    slidehtml+='<div class="fusedapp">';//-fusedapp
                        slidehtml+='<div class="item listsort"><span class="listsorttext" style="vertical-align:bottom;line-height: 24px;">最常用</span></div>';
                    var fusedappnum=0;
                        slidehtml+='<div class="fusedapplist up">';//-fusedapplist
                    appDataSet.length>10?fusedappnum=10:fusedappnum=appDataSet.length;
                    for(var i=0;i<fusedappnum;i++){
                            slidehtml+='<div class="item" title="'+appDataSet[i]["tips"]+'" ';
                        appDataSet[i]["clicktype"]==""?slidehtml+='onclick="">':slidehtml+='onclick="'+appDataSet[i]["func"]+'">';
                        switch(appDataSet[i]["icontype"]){
                            case "img":
                                slidehtml+='<img class="icon start-item-icon" src="'+mos._RootPath+appDataSet[i]["icon"]+'"/>';
                            break;
                            case "iconfont":
                                slidehtml+=appDataSet[i]["icon"];
                            break;
                        }
                            slidehtml+=appDataSet[i]["title"]+'</div>';
                    }
                        slidehtml+='</div>';//-fusedapplist
                        slidehtml+='<div class="item fusedapplistexpand"><span class="fusedapplistexpandtext">展开</span><i class="fusedapplistexpandicon fa fa-angle-down" style="padding-left:5px;"></i></div>';
                    slidehtml+='</div>';//-fusedapp
                }
                /*对菜单字母及拼音排序*/
                var charlist=[{"char":"A","list":[]},{"char":"B","list":[]},{"char":"C","list":[]},{"char":"D","list":[]},{"char":"E","list":[]},{"char":"F","list":[]},{"char":"G","list":[]},{"char":"H","list":[]},{"char":"I","list":[]},{"char":"J","list":[]},{"char":"K","list":[]},{"char":"L","list":[]},{"char":"M","list":[]},{"char":"N","list":[]},{"char":"O","list":[]},{"char":"P","list":[]},{"char":"Q","list":[]},{"char":"R","list":[]},{"char":"S","list":[]},{"char":"T","list":[]},{"char":"U","list":[]},{"char":"V","list":[]},{"char":"W","list":[]},{"char":"X","list":[]},{"char":"Y","list":[]},{"char":"Z","list":[]},{"char":"拼音A","list":[]},{"char":"拼音B","list":[]},{"char":"拼音C","list":[]},{"char":"拼音D","list":[]},{"char":"拼音E","list":[]},{"char":"拼音F","list":[]},{"char":"拼音G","list":[]},{"char":"拼音H","list":[]},{"char":"拼音I","list":[]},{"char":"拼音J","list":[]},{"char":"拼音K","list":[]},{"char":"拼音L","list":[]},{"char":"拼音M","list":[]},{"char":"拼音N","list":[]},{"char":"拼音O","list":[]},{"char":"拼音P","list":[]},{"char":"拼音Q","list":[]},{"char":"拼音R","list":[]},{"char":"拼音S","list":[]},{"char":"拼音T","list":[]},{"char":"拼音U","list":[]},{"char":"拼音V","list":[]},{"char":"拼音W","list":[]},{"char":"拼音X","list":[]},{"char":"拼音Y","list":[]},{"char":"拼音Z","list":[]}];
                slideDataSet.forEach(function(item,index){
                    /*if(mos.isChinese(slideDataSet[i]["title"].substr(0, 1))){
                        var char="拼音"+mos.convertPinyin(slideDataSet[i]["title"].substr(0, 1)).substr(0, 1).toUpperCase();
                        console.log(char);
                    }else{
                        console.log(slideDataSet[i]["title"].substr(0, 1).toUpperCase());
                    }*/
                    switch(slideDataSet[index]["char"]){
                        case "A":charlist[0]["list"].push(slideDataSet[index]);break;
                        case "B":charlist[1]["list"].push(slideDataSet[index]);break;
                        case "C":charlist[2]["list"].push(slideDataSet[index]);break;
                        case "D":charlist[3]["list"].push(slideDataSet[index]);break;
                        case "E":charlist[4]["list"].push(slideDataSet[index]);break;
                        case "F":charlist[5]["list"].push(slideDataSet[index]);break;
                        case "G":charlist[6]["list"].push(slideDataSet[index]);break;
                        case "H":charlist[7]["list"].push(slideDataSet[index]);break;
                        case "I":charlist[8]["list"].push(slideDataSet[index]);break;
                        case "J":charlist[9]["list"].push(slideDataSet[index]);break;
                        case "K":charlist[10]["list"].push(slideDataSet[index]);break;
                        case "L":charlist[11]["list"].push(slideDataSet[index]);break;
                        case "M":charlist[12]["list"].push(slideDataSet[index]);break;
                        case "N":charlist[13]["list"].push(slideDataSet[index]);break;
                        case "O":charlist[14]["list"].push(slideDataSet[index]);break;
                        case "P":charlist[15]["list"].push(slideDataSet[index]);break;
                        case "Q":charlist[16]["list"].push(slideDataSet[index]);break;
                        case "R":charlist[17]["list"].push(slideDataSet[index]);break;
                        case "S":charlist[18]["list"].push(slideDataSet[index]);break;
                        case "T":charlist[19]["list"].push(slideDataSet[index]);break;
                        case "U":charlist[20]["list"].push(slideDataSet[index]);break;
                        case "V":charlist[21]["list"].push(slideDataSet[index]);break;
                        case "W":charlist[22]["list"].push(slideDataSet[index]);break;
                        case "X":charlist[23]["list"].push(slideDataSet[index]);break;
                        case "Y":charlist[24]["list"].push(slideDataSet[index]);break;
                        case "Z":charlist[25]["list"].push(slideDataSet[index]);break;
                        case "拼音A":charlist[26]["list"].push(slideDataSet[index]);break;
                        case "拼音B":charlist[27]["list"].push(slideDataSet[index]);break;
                        case "拼音C":charlist[28]["list"].push(slideDataSet[index]);break;
                        case "拼音D":charlist[29]["list"].push(slideDataSet[index]);break;
                        case "拼音E":charlist[30]["list"].push(slideDataSet[index]);break;
                        case "拼音F":charlist[31]["list"].push(slideDataSet[index]);break;
                        case "拼音G":charlist[32]["list"].push(slideDataSet[index]);break;
                        case "拼音H":charlist[33]["list"].push(slideDataSet[index]);break;
                        case "拼音I":charlist[34]["list"].push(slideDataSet[index]);break;
                        case "拼音J":charlist[35]["list"].push(slideDataSet[index]);break;
                        case "拼音K":charlist[36]["list"].push(slideDataSet[index]);break;
                        case "拼音L":charlist[37]["list"].push(slideDataSet[index]);break;
                        case "拼音M":charlist[38]["list"].push(slideDataSet[index]);break;
                        case "拼音N":charlist[39]["list"].push(slideDataSet[index]);break;
                        case "拼音O":charlist[40]["list"].push(slideDataSet[index]);break;
                        case "拼音P":charlist[41]["list"].push(slideDataSet[index]);break;
                        case "拼音Q":charlist[42]["list"].push(slideDataSet[index]);break;
                        case "拼音R":charlist[43]["list"].push(slideDataSet[index]);break;
                        case "拼音S":charlist[44]["list"].push(slideDataSet[index]);break;
                        case "拼音T":charlist[45]["list"].push(slideDataSet[index]);break;
                        case "拼音U":charlist[46]["list"].push(slideDataSet[index]);break;
                        case "拼音V":charlist[47]["list"].push(slideDataSet[index]);break;
                        case "拼音W":charlist[48]["list"].push(slideDataSet[index]);break;
                        case "拼音X":charlist[49]["list"].push(slideDataSet[index]);break;
                        case "拼音Y":charlist[50]["list"].push(slideDataSet[index]);break;
                        case "拼音Z":charlist[51]["list"].push(slideDataSet[index]);break;
                    }
                    /*slidehtml+='<div class="'+slideDataSet[i]["slideclass"]+'" title="'+slideDataSet[i]["tips"]+'" ';
                    slideDataSet[i]["clicktype"]==""?slidehtml+='onclick="">':slidehtml+='onclick="'+slideDataSet[i]["func"]+'">';
                    slidehtml+=slideDataSet[i]["iconhtml"]+slideDataSet[i]["title"]+'</div>';*/
                });
                if(mos._usersetupDataSet["personal"]["items"][4]["item"]["shownearestapp"]=="on" || mos._usersetupDataSet["personal"]["items"][4]["item"]["showfusedapp"]=="on"){
                    var listcoverhtml='<div class="listcoverbox" char="nearandfused" state="list" style="font-size:25px;color:white;"><i class="fa fa-clock-o fa-flip-horizontal"></i></div>';
                }else{
                    var listcoverhtml='<div class="listcoverbox" char="nearandfused" state="nolist" style="font-size:25px;color:rgba(255,255,255,0.3);"><i class="fa fa-clock-o fa-flip-horizontal"></i></div>';
                } 
                charlist.forEach(function(item,index){
                    var fontsize;
                    index>25?fontsize=15:fontsize=25;               
                    if(item["list"].length>0){
                        listcoverhtml+='<div class="listcoverbox" char="'+item["char"]+'" state="list" style="font-size:'+fontsize+'px;color:white;">';
                        slidehtml+='<div class="item listsort" id="char'+item["char"]+'"><span class="listsorttext" style="vertical-align:bottom;line-height: 24px;">'+item["char"]+'</span></div>';
                        item["list"].forEach(function(nitem,nindex){
                            slidehtml+='<div class="'+nitem["slideclass"]+'" title="'+nitem["tips"]+'" ';
                            nitem["clicktype"]==""?slidehtml+='onclick="">':slidehtml+='onclick="'+nitem["func"]+'">';
                            switch(nitem["icontype"]){
                                case "img":
                                    slidehtml+='<img class="icon start-item-icon" src="'+mos._RootPath+nitem["icon"]+'"/>';
                                break;
                                case "iconfont":
                                    slidehtml+=nitem["icon"];
                                break;
                            }
                                slidehtml+=nitem["title"]+'</div>';
                        });
                    }else{
                        listcoverhtml+='<div class="listcoverbox" char="'+item["char"]+'" state="nolist"  style="font-size:'+fontsize+'px;color:rgba(255,255,255,0.3);">';
                    }
                    listcoverhtml+=item["char"]+'</div>';
                });
                $("#mos-menu .list").empty().append(slidehtml);
                $("#mos-menu .list .listcover").empty().append(listcoverhtml);
                $("#mos-menu .list .sub-item").slideUp();//有次级菜单项收起(叠加)
                $("#mos-menu .list .item").each(function () {//检查列表项
                    if($(this).next().hasClass('sub-item')){//如果有次级菜单
                        $(this).addClass('has-sub-down');//增加收起效果css
                        $(this).removeClass('has-sub-up');
                    }
                });
                //mos.buildList();//预处理左侧菜单
                $("#mos-menu .list .listcover").hide();
                $(".nearestapplistexpand").click(function(){
                    $(".nearestapplistexpandicon").toggleClass('fa-angle-down').toggleClass('fa-angle-up');
                    if($(".nearestapplistexpandicon").hasClass("fa-angle-down")){
                        $(".nearestapplistexpandtext")[0].innerText="展开";
                        $(".nearestapplist").removeClass("down").addClass("up");
                    }
                    if($(".nearestapplistexpandicon").hasClass("fa-angle-up")){
                        $(".nearestapplistexpandtext")[0].innerText="折叠";
                        $(".nearestapplist").removeClass("up").addClass("down");
                    }
                });
                $(".fusedapplistexpand").click(function(){
                    $(".fusedapplistexpandicon").toggleClass('fa-angle-down').toggleClass('fa-angle-up');
                    if($(".fusedapplistexpandicon").hasClass("fa-angle-down")){
                        $(".fusedapplistexpandtext")[0].innerText="展开";
                        $(".fusedapplist").removeClass("down").addClass("up");
                    }
                    if($(".fusedapplistexpandicon").hasClass("fa-angle-up")){
                        $(".fusedapplistexpandtext")[0].innerText="折叠";
                        $(".fusedapplist").removeClass("up").addClass("down");
                    }
                });
                $(".listsort").click(function(){
                    if(mos._usersetupDataSet["personal"]["items"][4]["item"]["shownearestapp"]=="on" || mos._usersetupDataSet["personal"]["items"][4]["item"]["showfusedapp"]=="on"){
                        $($(".listcover").children()[0]).attr({"state":"list","style":"font-size:25px;color:white;"});
                    }else{
                        $($(".listcover").children()[0]).attr({"state":"nolist","style":"font-size:25px;color:rgba(255,255,255,0.3);"});;
                    }
                    $("#mos-menu .list .listcover").show();
                });
                $("#mos-menu .list .listcoverbox").click(function(){
                    if($(this).attr("state")=="list"){
                        if($(this).attr("char")=="nearandfused"){
                            $("#mos-menu .list").animate({scrollTop:0},10);//滚动到指定位置
                        }else{
                            $("#mos-menu .list").animate({scrollTop: $("#char"+$(this).attr("char")).position().top},10);//滚动到指定位置
                        }
                        $("#mos-menu .list .listcover").hide();
                    }
                });
                $("#mos-menu .list .listcoverbox").hover(function(){
                    if($(this).attr("state")=="nolist"){//取消hover效果
                        $(this).css("border","1px solid rgba(255, 255, 255, 0)");
                    }
                });
            }
        }else{
            $("#mos-menu .list").hide();
        }
    },
    setblock:function(){//设置磁贴
        var blocksDataSet=mos._userdesktopDataSet["blocks"];
        if(mos._usersetupDataSet["personal"]["items"][4]["item"]["showblocks"]=="on"){
            if(blocksDataSet.length>0){
                var blockshtml="";
                for(var i=0;i<blocksDataSet.length;i++){
                    blockshtml+="<div class=menu_group>";
                        blockshtml+="<div index="+i+" class=\"title\">";
                            blockshtml+=blocksDataSet[i]["title"];
                        blockshtml+="</div>";
                    var blockslist=blocksDataSet[i]["blocklist"];
                    if(blockslist.length>0){
                        for(j=0;j<blockslist.length;j++){
                        blockshtml+="<div class=\"block\" loc=\""+blockslist[j]["loc"]+"\" size=\""+blockslist[j]["size"]+"\" onclick=\""+blockslist[j]["clickfunction"]+"\" title=\""+blockslist[j]["tips"]+"\">";
                            if(blockslist[j]["cover"]!==""){
                            blockshtml+="<div class=\""+blockslist[j]["cover"]+"\" style=\""+blockslist[j]["coverstyle"]+"\">";
                                blockshtml+=blockslist[j]["covercontent"];
                            blockshtml+="</div>";
                            }
                            blockshtml+="<div class=\""+blockslist[j]["detail"]+"\" style=\""+blockslist[j]["detailstyle"]+"\" onclick=\""+blockslist[j]["detailfunction"]+"\">";
                                blockshtml+=blockslist[j]["detailcontent"];
                                blockshtml+="<div style=\"position: absolute;text-align:left;font-size:13px;line-height:20px;bottom:5px;left:8px;\">"+blockslist[j]["detailcontenttitle"]+"</div>";
                            blockshtml+="</div>";
                        blockshtml+="</div>";
                        }
                    }
                    blockshtml+="</div>";
                }
                $("#mos-menu .blocks").empty().append(blockshtml);
                mos.renderMenuBlocks();//渲染磁贴
            }
        }else{
            $("#mos-menu .blocks").hide();
        }
        
    },
    openUrl: function (name,url,title,areaAndOffset,iconimg,appstyle,parameter,resize,skin,tad,iconclass,btnicon/*,layertype*/) {//根据url打开一个窗口
        //url-网址;title-标题文字;
        //reaAndOffset-窗口位置[['300px', '380px'],'rt'];[尺寸，区域];
        //[['宽','高'],['距离顶部距离','距离左边距离']];区域也可用简写表示-'rt'即右边顶部如:[['300px', '380px'],'rt']
        //iconimg-图标图像
        //appstyle-应用类型-"single";
        //parameter-其他参数数组[listid,cellid]-调用子页面中有列表和子项目时要用到的参数
        //resize-是否允许拉伸,默认为true
        //skin-皮肤
        //tad-标题附加html
        //iconclass-图标class
        //
        var lname=name;
        var resizeable=resize;
        var maxandmmin=true;
        var that=this;
        if(skin==undefined || skin==""){
            var mosskin='mos-open-iframe';
        }else{
            var mosskin=skin;
        }
        if(iconimg==undefined || iconimg==""){var icon_img="core/img/icon/default.png";}else{var icon_img=iconimg;}
        if(btnicon==undefined || btnicon==""){var icon_btn=icon_img;}else{var icon_btn=btnicon;}
        if(iconclass=="" || iconclass==undefined){var icon_class="icon";}else{var icon_class=iconclass;}
        //if(layertype=="" || layertype==undefined){var mlayertype="";}else{var mlayertype=layertype;}
        if(tad==undefined || tad==""){var tadd="";}else{var tadd=tad;}
        if(resizeable==undefined || resizeable=="true"){resizeable=true;/*maxandmmin=true;*/}else{resizeable=false;/*maxandmmin=false;*/}
        if(appstyle=="single"){
            if ($(".mlayer-title").length>0){
                for (var i=0;i<$(".mlayer-title").length;i++){
                    if(title.replace(/\s/ig,'')==$(".mlayer-title")[i].innerText.replace(/\s/ig,'')){
                        $("#"+$($(".mlayer-title")[i]).parent().attr("id")).show();
                        var index=$($(".mlayer-title")[i]).parent().attr("id").replace(/mlayer/g, '');
                        mos._settop($("#"+$($(".mlayer-title")[i]).parent().attr("id")));
                        $("#mos_btn_group_middle .btn").removeClass('show');
                        $('#mos_btn_group_middle .btn').removeClass('active');
                        $("#mos_"+index).addClass('show');
                        $("#mos_"+index).addClass('active');
                        mos.menuClose();
                        mos.commandCenterClose();
                        if (parameter!==undefined && parameter.length>0){//调用子页面中有列表和子项目时要用到的参数
                            var listid=parameter[0];
                            var cellid=parameter[1];
                            $("#"+$($(".mlayer-title")[i]).parent().attr("id")).attr({"listid":listid,"cellid":cellid,"showtime":0});
                            window.frames["mlayer-iframe"+index].location.reload();
                        }else{
                            $("#"+$($(".mlayer-title")[i]).parent().attr("id")).attr({"listid":"","cellid":""});
                        }
                        return index;
                        break;
                    }
                }
            }
        }
        if(this._countTask>19){
            layer.msg("开启窗口超过限制!");
            return false;
        }else{
            this._countTask++;
        }
        if(!url){url='404'}
        url=url.replace(/(^\s*)|(\s*$)/g, "");
        var preg=/^(https?:\/\/|\.\.?\/|\/\/?)/;
        if(!preg.test(url)){
            url=mos._RootPath+url;
        }else{
            url=url;
        }
        if (!url) {
            url = '//mos.cn';
        }
        if (!title) {
            title = url;
        }
        var area,offset;
        if (this.isSmallScreen() || areaAndOffset==='max') {
            area = ['100%', (document.body.clientHeight - 40) + 'px'];
            offset = ['0', '0'];
        }else if(typeof areaAndOffset ==='object'){
            area=areaAndOffset[0];
            offset=areaAndOffset[1];
        }else {
            area = ['60%', '80%'];
            var topset, leftset;
            topset = parseInt($(window).height());
            topset = (topset - (topset * 0.8)) / 2 - 20;
            leftset = parseInt($(window).width());
            leftset = (leftset - (leftset * 0.8)) / 2+150;
            offset = [topset + 'px',  leftset + 'px'];
        }
        var index = layer.open({
            type: 2,
            shadeClose: true,
            shade: false,
            maxmin: maxandmmin, //开启最大化最小化按钮
            title: title,
            name:lname,
            imgicon:mos._RootPath+icon_img,
            iconclass:icon_class,
            tadd:tadd,
            content:url,
            //mlayertype:layertype,
            resize:resizeable,
            moveOut: true,//是否允许拖拽到窗口外
            area: area,
            offset: offset,
            scrollbar: false,//屏蔽浏览器滚动条
            anim: -1,//弹出动画
            isOutAnim: false,//关闭动画
            skin:'mos-open-iframe',
            cancel: function (index, moslayer) {
                $("#mos_" + index).remove();
                mos._checkTop();
                mos._countTask--;//回退countTask数
                mos._renderBar();
            },
            min: function (moslayer) {
                moslayer.hide();
                $("#mos_" + index).removeClass('show');
                mos._checkTop();
                return false;
            },
            full:function (moslayer) {
                moslayer.find('.mlayer-min').css('display','inline-block');
            },
        });
        $('#mos_btn_group_middle .btn.active').removeClass('active');//取消任务栏中间按钮部分所有活动按钮状态
        $(".shortcut").removeClass("shortcut-focus");//取消桌面图标的选定状态
        //设置任务栏中间新按钮
        var btn = $('<div id="mos_'+index+'" index="'+index+'" class="btn show active"><div class="btn_title"><img class="icon" src="'+mos._RootPath+icon_btn+'" /></div><div class="mlayerpreview"></div></div>');/*'+</div><div class="btn_close fa fa-close"></div></div>');*///去掉了任务条小图标的关闭按钮
        var moslayer_opened=mos.getmoslayerByIndex(index);//设置打开的窗口
        if (parameter!==undefined && parameter.length>0){//调用子页面中列表要用了的参数
            var listid=parameter[0];
            var cellid=parameter[1];
            moslayer_opened.attr({"listid":listid,"cellid":cellid,"showtime":0});
            window.frames["mlayer-iframe"+index].location.reload();
        }else{
            moslayer_opened.attr({"listid":"","cellid":""});
        }
        moslayer_opened.css('z-index',mos._countTask+813);
        $(".mlayer-title").removeClass("active");
        $(".mlayer-border").removeClass("active");
        mos._settop(moslayer_opened);//将打开的窗口置于顶层
        //在窗口标题栏右边功能按钮区增加新按钮
        moslayer_opened.find('.mlayer-setwin').prepend(/*'<a style="cursor: default;" class="mos-btn-change-url" index="' + index + '" title="'+mos.lang('修改地址','Change URL')+'" onclick="return false"><span class="fa fa-chain"></span></a>'*/'<a style="cursor: default;" class="mos-btn-refresh" index="' + index + '" title="'+mos.lang('刷新','Refresh')+'" onclick="return false"><span class="fa fa-refresh"></span></a>');
        //将任务栏中间新按钮写入到任务栏中间部分
        $("#mos_btn_group_middle").append(btn);
        var curiframebody=$("#mlayer-iframe"+index).contents().find("body");
        mos._windows["mlayer-iframe"+index]={"oheight":curiframebody[0].clientHeight,"owidth":curiframebody[0].clientWidth};
        //预览小窗口
        btn.mouseenter(function(){
            var curmlayerprev=$(this).children(".mlayerpreview");
            $(".mlayerpreview").empty().hide();
            var btnindex=$(this).attr("index");
            var prevhtml='';
            prevhtml+='<div class="mlayerprevbg" id="mlayerprev'+btnindex+'">';
                prevhtml+='<div class="prevhead">';
                    prevhtml+='<div class="mlayerprev-title">'
                        prevhtml+='<img class="icon" style="float:left;margin-top:5px;" src="'+$("#mlayer"+btnindex+">.mlayer-title>img.icon").attr("src")+'" />  '+$("#mlayer"+btnindex+">.mlayer-title>.mtitle")[0].innerText;
                    prevhtml+='</div>';
                    prevhtml+='<div class="prevbtn">';
                        prevhtml+='<a class="mlayer-close" title="关闭"></a>';
                    prevhtml+='</div>';
                prevhtml+='</div>';    
                prevhtml+='<div class="smlayer">';
                    prevhtml+='<div class="smlayer-title" style="float:left;color:white;position:relative;width:180px;height:10px;">';
                if($($("#mlayer"+btnindex).children(".mlayer-title")).children("img").length>0){
                    prevhtml+='<img style="position:absolute;float:left;left:2px;top:1px;" src="'+$($("#mlayer"+btnindex).children(".mlayer-title")).children("img")[0].src+'" width=8px height=8px />';
                }
                        prevhtml+='<span style="position:absolute;float:left;left:12px;top:-1px;font-size:6px;-webkit-transform-origin-x:0;-webkit-transform: scale(0.5);height:10px;line-height:10px;">'+$($("#mlayer"+btnindex).children(".mlayer-title"))[0].innerText+'</span>';
                    prevhtml+='</div>'
                    prevhtml+='<div class="smlayer-content" style="float:left;position:relative;width:180px;height:100px;">';
                    prevhtml+='</div>'
                prevhtml+='</div>'
            prevhtml+='</div>';         
            $(curmlayerprev).append(prevhtml).show();
            if($("#mlayer-iframe"+btnindex).attr('src')!=="http://404"){
                /***********预览小窗口**********/
                var smlayercontent='';
                var curiframebody=$("#mlayer-iframe"+btnindex).contents().find("body");
                var curiframeheight=Number(mos._windows["mlayer-iframe"+btnindex]["oheight"]);//框架原始高
                var curiframewidth=Number(mos._windows["mlayer-iframe"+btnindex]["owidth"]);//框架原始宽
                smlayercontent+='<div id="smlayerprev'+btnindex+'" style="width:'+curiframewidth+'px;height:'+curiframeheight+'px;position:absolute;">';
                smlayercontent+=curiframebody[0].innerHTML;
                smlayercontent+='</div>'
                $(".smlayer-content").empty().append(smlayercontent);
                var scaleH=(100/curiframeheight).toFixed(4);
                var scaleW=(180/curiframewidth).toFixed(4);
                var newwidth=(scaleW*curiframewidth).toFixed(1);
                var newheight=(scaleH*curiframeheight).toFixed(1);
                var newtop=0-((curiframeheight-newheight)/2).toFixed(0);
                var newleft=0-((curiframewidth-newwidth)/2).toFixed(0);
                $("#smlayerprev"+btnindex)[0].style.top=""+newtop+"px";
                $("#smlayerprev"+btnindex)[0].style.left=""+newleft+"px";
                $("#smlayerprev"+btnindex)[0].style.transform="scale("+scaleW+","+scaleH+")";//scale是以文档中心进行缩放，所以参考点以中心点进行计算
                $("#smlayerprev"+btnindex)[0].style.WebkitTransform="scale("+scaleW+","+scaleH+")";
                $("#smlayerprev"+btnindex)[0].style.MozTransform="scale("+scaleW+","+scaleH+")";
                $("#smlayerprev"+btnindex)[0].style.OTransform="scale("+scaleW+","+scaleH+")";
                $("#smlayerprev"+btnindex)[0].style.msTransform="scale("+scaleW+","+scaleH+")";
                /***********预览小窗口**********/
                //设置磁贴
                mos.setblock();
                //系统消息中心
                mos.newMsg(mos._username);
            }
            var tipsindex=null;
            $("#mlayerprev"+btnindex).mouseenter(function(){
                $($("#mlayerprev"+btnindex).find(".mlayer-close")).show();
                tipsindex=layer.tips($($("#mlayer"+btnindex).children(".mlayer-title"))[0].innerText, this, {
                    tips: [1, '#fff'] //还可配置颜色
                });
            });
            $("#mlayerprev"+btnindex).mouseleave(function(){
                $($("#mlayerprev"+btnindex).find(".mlayer-close")).hide();
                layer.close(tipsindex);
            });
            $($("#mlayerprev"+btnindex).find(".mlayer-close")).click(function(e){
                layer.close(tipsindex);
                mos._closeWin(index);
                e.stopPropagation();
            });
        });
        btn.mouseleave(function(){
            $(".mlayerpreview").hide();  
        });   
        mos._renderBar();
        btn.click(function () {
            $(".mlayerpreview").hide();
            var index = $(this).attr('index');
            var moslayer = mos.getmoslayerByIndex(index);
            var settop=function () {
                //置顶窗口
                var max_zindex=0;
                $(".mos-open-iframe").each(function () {
                    z=parseInt($(this).css('z-index'));
                    $(this).css('z-index',z-1);
                    if(z>max_zindex){max_zindex=z;}
                });
                moslayer.css('z-index',max_zindex+1);

            };
            if ($(this).hasClass('show')) {
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $(this).removeClass('show');
                    mos._checkTop();
                    moslayer.hide();
                }else{
                    $('#mos_btn_group_middle .btn.active').removeClass('active');
                    $(this).addClass('active');
                    mos._settop(moslayer);
                }
            } else {
                $(this).addClass('show');
                $('#mos_btn_group_middle .btn.active').removeClass('active');
                $(this).addClass('active');
                mos._settop(moslayer);
                moslayer.show();
            }
        });
        mos._iframeOnClick.track(moslayer_opened.find('iframe:first')[0], function() {
            if(Object.getOwnPropertyNames(mos._iframe_click_lock_children).length===0){
                mos._settop(moslayer_opened);
                mos._checkTop();
            }else{
                console.log('click locked');
            }
        });
        moslayer_opened.find('.mlayer-close').click(function(){//关闭窗口
            mos._closeWin(moslayer_opened.attr("index"));
        });
        this.menuClose();//关闭开始菜单
        this.commandCenterClose();//关闭消息中心
        mos.setactivelayer();
        return index;
    },
    closeAll: function() {//关闭所有窗口
        $(".mos-open-iframe").remove();
        $("#mos_btn_group_middle").html("");
        mos._countTask = 0;
        mos._renderBar();
    },
    netfileexist:function(FileURL){//网络文件是否存在-FileURL文件路径(相对路径)
        if(FileURL.length==0){
            return false;
        }
        var isExist=true;
        $.ajax(FileURL, {
            type: 'get',
            async:false,//取消ajax的异步实现
            timeout: 1000,
            success: function() {
            },
            error: function() {
                isExist = false;  
            }
        });
        return isExist;
    },
    showAlltips:function(tipsDataSet){//显示所有提示-tipsDataSet=[]
        if(tipsDataSet.length>0){
            for(var i=0;i<tipsDataSet.length;i++){
                if(tipsDataSet[i].length>0){
                    for(var j=0;j<tipsDataSet[i].length;j++){
                        if(tipsDataSet[i][j]["tipstype"]!=="system"){
                            mos._showtips("#"+tipsDataSet[i][j]["id"],tipsDataSet[i][j]["index"],tipsDataSet[i][j]["tipstype"],tipsDataSet[i][j]["tipscontent"],tipsDataSet[i][j]["tipsposition"]);
                        }
                    }
                }
            }
        }    
    },
    setAnimated:function (animated_classes,animated_liveness) {
        this._animated_classes=animated_classes;
        this._animated_liveness=animated_liveness;
    },
    setContextMenuByuserName:function (username) {//设置用户右键菜单
        usercmdata=mos._userCmenuDataSet;
        for (var i=0;i<usercmdata.length;i++){   
            var dom=usercmdata[i]["dom"];
            if(usercmdata[i]["menu"].length>0){
                var menu=[];
                for (var j=0;j<usercmdata[i]["menu"].length;j++) {
                    var level="";
                    if(usercmdata[i]["menu"][j]["children"].length>0){
                        var menu1=[];
                        menu1.push(usercmdata[i]["menu"][j]["lefticon"]+eval("("+usercmdata[i]["menu"][j]["title"]+")")+usercmdata[i]["menu"][j]["righticon"]);
                        for(var k=0;k<usercmdata[i]["menu"][j]["children"].length;k++){
                            var level1="";
                            if(usercmdata[i]["menu"][j]["children"][k]["children"].length>0){
                                var menu2=[];
                                menu2.push(usercmdata[i]["menu"][j]["children"][k]["lefticon"]+eval("("+usercmdata[i]["menu"][j]["children"][k]["title"]+")")+usercmdata[i]["menu"][j]["children"][k]["righticon"]);
                                for(var l=0;l<usercmdata[i]["menu"][j]["children"][k]["children"].length;l++){
                                    var level2="";
                                    if(usercmdata[i]["menu"][j]["children"][k]["children"][l]["children"].length>0){//三级子菜单用-即第4级菜单

                                    }else{
                                        if(usercmdata[i]["menu"][j]["children"][k]["children"][l]["title"]=="|"){
                                            level2+="|";
                                        }else{
                                            var func=usercmdata[i]["menu"][j]["children"][k]["children"][l]["func"];
                                            level2=[usercmdata[i]["menu"][j]["children"][k]["children"][l]["lefticon"]+eval("("+usercmdata[i]["menu"][j]["children"][k]["children"][l]["title"]+")")+usercmdata[i]["menu"][j]["children"][k]["children"][l]["righticon"],new Function(func)];
                                        }
                                    }
                                    menu2.push(level2);
                                }
                                level1=menu2;
                            }else{
                                if(usercmdata[i]["menu"][j]["children"][k]["title"]=="|"){
                                    level1+="|";
                                }else{
                                    var func=usercmdata[i]["menu"][j]["children"][k]["func"];
                                    level1=[usercmdata[i]["menu"][j]["children"][k]["lefticon"]+eval("("+usercmdata[i]["menu"][j]["children"][k]["title"]+")")+usercmdata[i]["menu"][j]["children"][k]["righticon"],new Function(func)];
                                }
                            }
                            menu1.push(level1);
                        }
                        level=menu1;
                    }else{
                        if (usercmdata[i]["menu"][j]["title"]=="|"){
                            level+="|";
                        }else{
                            var func=usercmdata[i]["menu"][j]["func"];
                            level=[usercmdata[i]["menu"][j]["lefticon"]+eval("("+usercmdata[i]["menu"][j]["title"]+")")+usercmdata[i]["menu"][j]["righticon"],new Function(func)];
                        }
                    }
                    menu.push(level);                  
                }
                mos.setContextMenu(dom,menu);
            }
        }
    },
    setContextMenu:function (jq_dom, menu) {//设置右键菜单
        if(typeof (jq_dom)==='string'){
            jq_dom=$(jq_dom);
        }
        jq_dom.unbind('contextmenu');
        jq_dom.on('contextmenu', function(e) {
            if(menu){
                mos._renderContextMenu(e.clientX,e.clientY,menu,this);
                if (e.cancelable) {
                    // 判断默认行为是否已经被禁用
                    if (!e.defaultPrevented) {
                        e.preventDefault();
                    }
                }
                e.stopPropagation();
            }
        });
    },
    /*保存相关数据*/
    savedesktop:function (username,desktopDataSet){//保存桌面数据
        var Database={};
        Database["username"]=username;
        Database["desktop"]=JSON.stringify(desktopDataSet);
        $.post(mos._RootPath+"template/save.php",Database);//post数据到服务器,注意路径 
    },
    savecmenu:function (username,cmenuDataSet){//保存用户右键菜单数据
        var Database={};
        Database["username"]=username;
        Database["cmenu"]='{"data":'+JSON.stringify(cmenuDataSet)+'}';
        $.post(mos._RootPath+"template/save.php",Database);//post数据到服务器,注意路径 
    },
    savebasemsg:function(baseMsgDataSet){//保存基本消息
        var Database={};
        Database["baseMsg"]='{"data":'+JSON.stringify(baseMsgDataSet)+'}';
        $.post(mos._RootPath+"template/save.php",Database);//post数据到服务器,注意路径 
    },
    saveusermsg:function(username,userMsgDataSet){//保存用户消息
        var Database={};
        Database["username"]=username;
        Database["userMsg"]='{"data":'+JSON.stringify(userMsgDataSet)+'}';
        $.post(mos._RootPath+"template/save.php",Database);//post数据到服务器,注意路径 
    },
    saveusersetup:function (username,usersetupDataSet){//保存用户的所有数据
        var Database={};
        Database["username"]=username;
        Database["usersetup"]=JSON.stringify(usersetupDataSet);
        $.post(mos._RootPath+"template/save.php",Database);//post数据到服务器,注意路径 
    },
    savecss:function(cssfile,csstext){
        var Database={};
        Database["cssfile"]=""+cssfile;
        Database["css"]=csstext;
        $.post(mos._RootPath+"template/save.php",Database);//post数据到服务器,注意路径
    },
    /*保存相关数据*/
    exit:function () {//退出MOS
        layer.confirm(mos.lang('确认要退出MOS吗?','Are you sure you want to close this page?'), {icon: 3, title:mos.lang('提示','Prompt')}, function(index){
            document.body.onbeforeunload = function(){};
            window.location.href="about:blank";
            window.close();
            layer.close(index);
            layer.alert(mos.lang('哎呀,好像失败了呢。','Ops...There seems to be a little problem.'), {
                skin: 'mlayer-lan'
                ,closeBtn: 0
            });
        });

    },
    lang:function (cn,en) {
        return this._lang==='zh-cn'||this._lang==='zh-tw'?cn:en;
    },
    aboutUs: function() {
        //关于我们
        layer.open({
            type: 1,
            closeBtn: 1, //不显示关闭按钮0
            anim: 2,
            skin: 'mlayer-molv',
            title: 'MOS '+this._version,
            shade:false,
            shadeClose: true, //开启遮罩关闭
            area: ['320px', '200px'], //宽高
            content: '<div style="padding: 10px;font-size: 12px">' +
            '<p>MOS</p>' +
            '<p>邮箱:michael.lions@Gmail.com</p>' +
            '</div>'
        });
    },
    hideWins:function () {//隐藏所有窗口
        $('#mos_btn_group_middle>.btn.show').each(function () {
            var index = $(this).attr('index');
            var moslayer = mos.getmoslayerByIndex(index);
            $(this).removeClass('show');
            $(this).removeClass('active');
            moslayer.hide();
        })
    },
    showWins:function () {//显示所有窗口
        $('#mos_btn_group_middle>.btn').each(function () {
            var index = $(this).attr('index');
            var moslayer = mos.getmoslayerByIndex(index);
            $(this).addClass('show');
            moslayer.show();
        });
        mos._checkTop();
    },
    drag:function(obj){
        obj.bind("mousedown",start);  
        function start(event){  
            if(event.button==0){//判断是否点击鼠标左键  
                /*  
                 * clientX和clientY代表鼠标当前的横纵坐标  
                 * offset()该方法返回的对象包含两个整型属性：top 和 left，以像素计。此方法只对可见元素有效。  
                 * bind()绑定事件，同样unbind解绑定，此效果的实现最后必须要解绑定，否则鼠标松开后拖拽效果依然存在  
                 * getX获取当前鼠标横坐标和对象离屏幕左侧距离之差（也就是left）值，  
                 * getY和getX同样道理，这两个差值就是鼠标相对于对象的定位，因为拖拽后鼠标和拖拽对象的相对位置是不变的  
                 */  
                gapX=event.clientX-obj.offset().left;  
                gapY=event.clientY-obj.offset().top;  
                //movemove事件必须绑定到$(document)上，鼠标移动是在整个屏幕上的  
                $(document).bind("mousemove",move);  
                //此处的$(document)可以改为obj  
                $(document).bind("mouseup",stop);  
                 
            }  
            return false;//阻止默认事件或冒泡  
        }  
        function move(event){  
            obj.css({  
                "left":(event.clientX-gapX)+"px",  
                "top":(event.clientY-gapY)+"px"  
            });  
            return false;//阻止默认事件或冒泡  
        }  
        function stop(){  
            //解绑定，这一步很必要，前面有解释  
            $(document).unbind("mousemove",move);  
            $(document).unbind("mouseup",stop);  
              
        }
    },
    sortJson:function(jsonObj,sortKey,sortStyle){//jsonObj-排序json数组;json排序-sortKey-排序关键字;sortSttyle-升序asc/降序desc
        //对json进行升序排序函数  
        var asc = function(x,y) {  
            return (x[sortKey] > y[sortKey]) ? 1 : -1  
        };
        //对json进行降序排序函数   
        var desc = function(x,y) {  
            return (x[sortKey] < y[sortKey]) ? 1 : -1  
        }
        switch(sortStyle){
            case "asc":
                jsonObj.sort(asc); //升序排序
            break;
            case "desc":
                jsonObj.sort(desc); //降序排序
            break;
        }
    },
    getDesktopScene:function () {
        return $("#mos-desktop-scene");
    },
    onReady:function (handle) {
        mos._handleReady.push(handle);
    },
    /*百分数字符串转小数*/
    toFloat:function(percent){
        var str=percent.replace("%","");
        str= str/100;
        return str;
    },
    /*判断字符串是否全是中文*/
    isChinese:function(str) {
        if (/^[\u4e00-\u9fa5]+$/.test(str)) {
            return true;
        } else {
            return false;
        }
    },
    /*中文转换为拼音*/
    convertPinyin:function(char) {
        var PinYin = {  
            "a": "\u554a\u963f\u9515",  
            "ai": "\u57c3\u6328\u54ce\u5509\u54c0\u7691\u764c\u853c\u77ee\u827e\u788d\u7231\u9698\u8bf6\u6371\u55f3\u55cc\u5ad2\u7477\u66a7\u7839\u953f\u972d",  
            "an": "\u978d\u6c28\u5b89\u4ffa\u6309\u6697\u5cb8\u80fa\u6848\u8c19\u57ef\u63de\u72b4\u5eb5\u6849\u94f5\u9e4c\u9878\u9eef",  
            "ang": "\u80ae\u6602\u76ce",  
            "ao": "\u51f9\u6556\u71ac\u7ff1\u8884\u50b2\u5965\u61ca\u6fb3\u5773\u62d7\u55f7\u5662\u5c99\u5ed2\u9068\u5aaa\u9a9c\u8071\u87af\u93ca\u9ccc\u93d6",  
            "ba": "\u82ad\u634c\u6252\u53ed\u5427\u7b06\u516b\u75a4\u5df4\u62d4\u8dcb\u9776\u628a\u8019\u575d\u9738\u7f62\u7238\u8307\u83dd\u8406\u636d\u5c9c\u705e\u6777\u94af\u7c91\u9c85\u9b43",  
            "bai": "\u767d\u67cf\u767e\u6446\u4f70\u8d25\u62dc\u7a17\u859c\u63b0\u97b4",  
            "ban": "\u6591\u73ed\u642c\u6273\u822c\u9881\u677f\u7248\u626e\u62cc\u4f34\u74e3\u534a\u529e\u7eca\u962a\u5742\u8c73\u94a3\u7622\u764d\u8228",  
            "bang": "\u90a6\u5e2e\u6886\u699c\u8180\u7ed1\u68d2\u78c5\u868c\u9551\u508d\u8c24\u84a1\u8783",  
            "bao": "\u82de\u80de\u5305\u8912\u96f9\u4fdd\u5821\u9971\u5b9d\u62b1\u62a5\u66b4\u8c79\u9c8d\u7206\u52f9\u8446\u5b80\u5b62\u7172\u9e28\u8913\u8db5\u9f85",  
            "bo": "\u5265\u8584\u73bb\u83e0\u64ad\u62e8\u94b5\u6ce2\u535a\u52c3\u640f\u94c2\u7b94\u4f2f\u5e1b\u8236\u8116\u818a\u6e24\u6cca\u9a73\u4eb3\u8543\u5575\u997d\u6a97\u64d8\u7934\u94b9\u9e41\u7c38\u8ddb",  
            "bei": "\u676f\u7891\u60b2\u5351\u5317\u8f88\u80cc\u8d1d\u94a1\u500d\u72c8\u5907\u60eb\u7119\u88ab\u5b5b\u9642\u90b6\u57e4\u84d3\u5457\u602b\u6096\u789a\u9e4e\u8919\u943e",  
            "ben": "\u5954\u82ef\u672c\u7b28\u755a\u574c\u951b",  
            "beng": "\u5d29\u7ef7\u752d\u6cf5\u8e66\u8ff8\u552a\u5623\u750f",  
            "bi": "\u903c\u9f3b\u6bd4\u9119\u7b14\u5f7c\u78a7\u84d6\u853d\u6bd5\u6bd9\u6bd6\u5e01\u5e87\u75f9\u95ed\u655d\u5f0a\u5fc5\u8f9f\u58c1\u81c2\u907f\u965b\u5315\u4ef3\u4ffe\u8298\u835c\u8378\u5421\u54d4\u72f4\u5eb3\u610e\u6ed7\u6fde\u5f3c\u59a3\u5a62\u5b16\u74a7\u8d32\u7540\u94cb\u79d5\u88e8\u7b5a\u7b85\u7be6\u822d\u895e\u8df8\u9ac0",  
            "bian": "\u97ad\u8fb9\u7f16\u8d2c\u6241\u4fbf\u53d8\u535e\u8fa8\u8fa9\u8fab\u904d\u533e\u5f01\u82c4\u5fed\u6c74\u7f0f\u7178\u782d\u78a5\u7a39\u7a86\u8759\u7b3e\u9cca",  
            "biao": "\u6807\u5f6a\u8198\u8868\u5a4a\u9aa0\u98d1\u98d9\u98da\u706c\u9556\u9573\u762d\u88f1\u9cd4",  
            "bie": "\u9cd6\u618b\u522b\u762a\u8e69\u9cd8",  
            "bin": "\u5f6c\u658c\u6fd2\u6ee8\u5bbe\u6448\u50a7\u6d5c\u7f24\u73a2\u6ba1\u8191\u9554\u9acc\u9b13",  
            "bing": "\u5175\u51b0\u67c4\u4e19\u79c9\u997c\u70b3\u75c5\u5e76\u7980\u90b4\u6452\u7ee0\u678b\u69df\u71f9",  
            "bu": "\u6355\u535c\u54fa\u8865\u57e0\u4e0d\u5e03\u6b65\u7c3f\u90e8\u6016\u62ca\u535f\u900b\u74ff\u6661\u949a\u91ad",  
            "ca": "\u64e6\u5693\u7924",  
            "cai": "\u731c\u88c1\u6750\u624d\u8d22\u776c\u8e29\u91c7\u5f69\u83dc\u8521",  
            "can": "\u9910\u53c2\u8695\u6b8b\u60ed\u60e8\u707f\u9a96\u74a8\u7cb2\u9eea",  
            "cang": "\u82cd\u8231\u4ed3\u6ca7\u85cf\u4f27",  
            "cao": "\u64cd\u7cd9\u69fd\u66f9\u8349\u8279\u5608\u6f15\u87ac\u825a",  
            "ce": "\u5395\u7b56\u4fa7\u518c\u6d4b\u5202\u5e3b\u607b",  
            "ceng": "\u5c42\u8e6d\u564c",  
            "cha": "\u63d2\u53c9\u832c\u8336\u67e5\u78b4\u643d\u5bdf\u5c94\u5dee\u8be7\u7339\u9987\u6c4a\u59f9\u6748\u6942\u69ce\u6aab\u9497\u9538\u9572\u8869",  
            "chai": "\u62c6\u67f4\u8c7a\u4faa\u8308\u7625\u867f\u9f87",  
            "chan": "\u6400\u63ba\u8749\u998b\u8c17\u7f20\u94f2\u4ea7\u9610\u98a4\u5181\u8c04\u8c36\u8487\u5edb\u5fcf\u6f7a\u6fb6\u5b71\u7fbc\u5a75\u5b17\u9aa3\u89c7\u7985\u9561\u88e3\u87fe\u8e94",  
            "chang": "\u660c\u7316\u573a\u5c1d\u5e38\u957f\u507f\u80a0\u5382\u655e\u7545\u5531\u5021\u4f25\u9b2f\u82cc\u83d6\u5f9c\u6005\u60dd\u960a\u5a3c\u5ae6\u6636\u6c05\u9cb3",  
            "chao": "\u8d85\u6284\u949e\u671d\u5632\u6f6e\u5de2\u5435\u7092\u600a\u7ec9\u6641\u8016",  
            "che": "\u8f66\u626f\u64a4\u63a3\u5f7b\u6f88\u577c\u5c6e\u7817",  
            "chen": "\u90f4\u81e3\u8fb0\u5c18\u6668\u5ff1\u6c89\u9648\u8d81\u886c\u79f0\u8c0c\u62bb\u55d4\u5bb8\u741b\u6987\u809c\u80c2\u789c\u9f80",  
            "cheng": "\u6491\u57ce\u6a59\u6210\u5448\u4e58\u7a0b\u60e9\u6f84\u8bda\u627f\u901e\u9a8b\u79e4\u57d5\u5d4a\u5fb5\u6d48\u67a8\u67fd\u6a18\u665f\u584d\u77a0\u94d6\u88ce\u86cf\u9172",  
            "chi": "\u5403\u75f4\u6301\u5319\u6c60\u8fdf\u5f1b\u9a70\u803b\u9f7f\u4f88\u5c3a\u8d64\u7fc5\u65a5\u70bd\u50ba\u5880\u82aa\u830c\u640b\u53f1\u54e7\u557b\u55e4\u5f73\u996c\u6cb2\u5ab8\u6555\u80dd\u7719\u7735\u9e31\u761b\u892b\u86a9\u87ad\u7b1e\u7bea\u8c49\u8e05\u8e1f\u9b51",  
            "chong": "\u5145\u51b2\u866b\u5d07\u5ba0\u833a\u5fe1\u61a7\u94f3\u825f",  
            "chou": "\u62bd\u916c\u7574\u8e0c\u7a20\u6101\u7b79\u4ec7\u7ef8\u7785\u4e11\u4fe6\u5733\u5e31\u60c6\u6eb4\u59af\u7633\u96e0\u9c8b",  
            "chu": "\u81ed\u521d\u51fa\u6a71\u53a8\u8e87\u9504\u96cf\u6ec1\u9664\u695a\u7840\u50a8\u77d7\u6410\u89e6\u5904\u4e8d\u520d\u61b7\u7ecc\u6775\u696e\u6a17\u870d\u8e70\u9edc",  
            "chuan": "\u63e3\u5ddd\u7a7f\u693d\u4f20\u8239\u5598\u4e32\u63be\u821b\u60f4\u9044\u5ddb\u6c1a\u948f\u9569\u8221",  
            "chuang": "\u75ae\u7a97\u5e62\u5e8a\u95ef\u521b\u6006",  
            "chui": "\u5439\u708a\u6376\u9524\u5782\u9672\u68f0\u69cc",  
            "chun": "\u6625\u693f\u9187\u5507\u6df3\u7eaf\u8822\u4fc3\u83bc\u6c8c\u80ab\u6710\u9e51\u877d",  
            "chuo": "\u6233\u7ef0\u851f\u8fb6\u8f8d\u955e\u8e14\u9f8a",  
            "ci": "\u75b5\u8328\u78c1\u96cc\u8f9e\u6148\u74f7\u8bcd\u6b64\u523a\u8d50\u6b21\u8360\u5472\u5d6f\u9e5a\u8785\u7ccd\u8d91",  
            "cong": "\u806a\u8471\u56f1\u5306\u4ece\u4e1b\u506c\u82c1\u6dd9\u9aa2\u742e\u7481\u679e",  
            "cu": "\u51d1\u7c97\u918b\u7c07\u731d\u6b82\u8e59",  
            "cuan": "\u8e7f\u7be1\u7a9c\u6c46\u64ba\u6615\u7228",  
            "cui": "\u6467\u5d14\u50ac\u8106\u7601\u7cb9\u6dec\u7fe0\u8403\u60b4\u7480\u69b1\u96b9",  
            "cun": "\u6751\u5b58\u5bf8\u78cb\u5fd6\u76b4",  
            "cuo": "\u64ae\u6413\u63aa\u632b\u9519\u539d\u811e\u9509\u77ec\u75e4\u9e7e\u8e49\u8e9c",  
            "da": "\u642d\u8fbe\u7b54\u7629\u6253\u5927\u8037\u54d2\u55d2\u601b\u59b2\u75b8\u8921\u7b2a\u977c\u9791",  
            "dai": "\u5446\u6b79\u50a3\u6234\u5e26\u6b86\u4ee3\u8d37\u888b\u5f85\u902e\u6020\u57ed\u7519\u5454\u5cb1\u8fe8\u902f\u9a80\u7ed0\u73b3\u9edb",  
            "dan": "\u803d\u62c5\u4e39\u5355\u90f8\u63b8\u80c6\u65e6\u6c2e\u4f46\u60ee\u6de1\u8bde\u5f39\u86cb\u4ebb\u510b\u5369\u840f\u5556\u6fb9\u6a90\u6b9a\u8d55\u7708\u7605\u8043\u7baa",  
            "dang": "\u5f53\u6321\u515a\u8361\u6863\u8c20\u51fc\u83ea\u5b95\u7800\u94db\u88c6",  
            "dao": "\u5200\u6363\u8e48\u5012\u5c9b\u7977\u5bfc\u5230\u7a3b\u60bc\u9053\u76d7\u53e8\u5541\u5fc9\u6d2e\u6c18\u7118\u5fd1\u7e9b",  
            "de": "\u5fb7\u5f97\u7684\u951d",  
            "deng": "\u8e6c\u706f\u767b\u7b49\u77aa\u51f3\u9093\u5654\u5d9d\u6225\u78f4\u956b\u7c26",  
            "di": "\u5824\u4f4e\u6ef4\u8fea\u654c\u7b1b\u72c4\u6da4\u7fdf\u5ae1\u62b5\u5e95\u5730\u8482\u7b2c\u5e1d\u5f1f\u9012\u7f14\u6c10\u7c74\u8bcb\u8c1b\u90b8\u577b\u839c\u837b\u5600\u5a23\u67e2\u68e3\u89cc\u7825\u78b2\u7747\u955d\u7f9d\u9ab6",  
            "dian": "\u98a0\u6382\u6ec7\u7898\u70b9\u5178\u975b\u57ab\u7535\u4f43\u7538\u5e97\u60e6\u5960\u6dc0\u6bbf\u4e36\u963d\u576b\u57dd\u5dc5\u73b7\u765c\u766b\u7c1f\u8e2e",  
            "diao": "\u7889\u53fc\u96d5\u51cb\u5201\u6389\u540a\u9493\u8c03\u8f7a\u94de\u8729\u7c9c\u8c82",  
            "die": "\u8dcc\u7239\u789f\u8776\u8fed\u8c0d\u53e0\u4f5a\u57a4\u581e\u63f2\u558b\u6e2b\u8f76\u7252\u74de\u8936\u800b\u8e40\u9cbd\u9cce",  
            "ding": "\u4e01\u76ef\u53ee\u9489\u9876\u9f0e\u952d\u5b9a\u8ba2\u4e22\u4ec3\u5576\u738e\u815a\u7887\u753a\u94e4\u7594\u8035\u914a",  
            "dong": "\u4e1c\u51ac\u8463\u61c2\u52a8\u680b\u4f97\u606b\u51bb\u6d1e\u578c\u549a\u5cbd\u5cd2\u5902\u6c21\u80e8\u80f4\u7850\u9e2b",  
            "dou": "\u515c\u6296\u6597\u9661\u8c46\u9017\u75d8\u8538\u94ad\u7aa6\u7aac\u86aa\u7bfc\u9161",  
            "du": "\u90fd\u7763\u6bd2\u728a\u72ec\u8bfb\u5835\u7779\u8d4c\u675c\u9540\u809a\u5ea6\u6e21\u5992\u828f\u561f\u6e0e\u691f\u6a50\u724d\u8839\u7b03\u9ad1\u9ee9",  
            "duan": "\u7aef\u77ed\u953b\u6bb5\u65ad\u7f0e\u5f56\u6934\u7145\u7c16",  
            "dui": "\u5806\u5151\u961f\u5bf9\u603c\u619d\u7893",  
            "dun": "\u58a9\u5428\u8e72\u6566\u987f\u56e4\u949d\u76fe\u9041\u7096\u7818\u7905\u76f9\u9566\u8db8",  
            "duo": "\u6387\u54c6\u591a\u593a\u579b\u8eb2\u6735\u8dfa\u8235\u5241\u60f0\u5815\u5484\u54da\u7f0d\u67c1\u94ce\u88f0\u8e31",  
            "e": "\u86fe\u5ce8\u9e45\u4fc4\u989d\u8bb9\u5a25\u6076\u5384\u627c\u904f\u9102\u997f\u5669\u8c14\u57a9\u57ad\u82ca\u83aa\u843c\u5443\u6115\u5c59\u5a40\u8f6d\u66f7\u816d\u786a\u9507\u9537\u9e57\u989a\u9cc4",  
            "en": "\u6069\u84bd\u6441\u5514\u55ef",  
            "er": "\u800c\u513f\u8033\u5c14\u9975\u6d31\u4e8c\u8d30\u8fe9\u73e5\u94d2\u9e38\u9c95",  
            "fa": "\u53d1\u7f5a\u7b4f\u4f10\u4e4f\u9600\u6cd5\u73d0\u57a1\u781d",  
            "fan": "\u85e9\u5e06\u756a\u7ffb\u6a0a\u77fe\u9492\u7e41\u51e1\u70e6\u53cd\u8fd4\u8303\u8d29\u72af\u996d\u6cdb\u8629\u5e61\u72ad\u68b5\u6535\u71d4\u7548\u8e6f",  
            "fang": "\u574a\u82b3\u65b9\u80aa\u623f\u9632\u59a8\u4eff\u8bbf\u7eba\u653e\u531a\u90a1\u5f77\u94ab\u822b\u9c82",  
            "fei": "\u83f2\u975e\u5561\u98de\u80a5\u532a\u8bfd\u5420\u80ba\u5e9f\u6cb8\u8d39\u82be\u72d2\u60b1\u6ddd\u5983\u7ecb\u7eef\u69a7\u8153\u6590\u6249\u7953\u7829\u9544\u75f1\u871a\u7bda\u7fe1\u970f\u9cb1",  
            "fen": "\u82ac\u915a\u5429\u6c1b\u5206\u7eb7\u575f\u711a\u6c7e\u7c89\u594b\u4efd\u5fff\u6124\u7caa\u507e\u7035\u68fc\u610d\u9cbc\u9f22",  
            "feng": "\u4e30\u5c01\u67ab\u8702\u5cf0\u950b\u98ce\u75af\u70fd\u9022\u51af\u7f1d\u8bbd\u5949\u51e4\u4ff8\u9146\u8451\u6ca3\u781c",  
            "fu": "\u4f5b\u5426\u592b\u6577\u80a4\u5b75\u6276\u62c2\u8f90\u5e45\u6c1f\u7b26\u4f0f\u4fd8\u670d\u6d6e\u6daa\u798f\u88b1\u5f17\u752b\u629a\u8f85\u4fef\u91dc\u65a7\u812f\u8151\u5e9c\u8150\u8d74\u526f\u8986\u8d4b\u590d\u5085\u4ed8\u961c\u7236\u8179\u8d1f\u5bcc\u8ba3\u9644\u5987\u7f1a\u5490\u5310\u51eb\u90db\u8299\u82fb\u832f\u83a9\u83d4\u544b\u5e5e\u6ecf\u8274\u5b5a\u9a78\u7ec2\u6874\u8d59\u9efb\u9efc\u7f58\u7a03\u99a5\u864d\u86a8\u8709\u8760\u876e\u9eb8\u8dba\u8dd7\u9cc6",  
            "ga": "\u5676\u560e\u86e4\u5c2c\u5477\u5c15\u5c1c\u65ee\u9486",  
            "gai": "\u8be5\u6539\u6982\u9499\u76d6\u6e89\u4e10\u9654\u5793\u6224\u8d45\u80f2",  
            "gan": "\u5e72\u7518\u6746\u67d1\u7aff\u809d\u8d76\u611f\u79c6\u6562\u8d63\u5769\u82f7\u5c34\u64c0\u6cd4\u6de6\u6f89\u7ec0\u6a44\u65f0\u77f8\u75b3\u9150",  
            "gang": "\u5188\u521a\u94a2\u7f38\u809b\u7eb2\u5c97\u6e2f\u6206\u7f61\u9883\u7b7b",  
            "gong": "\u6760\u5de5\u653b\u529f\u606d\u9f9a\u4f9b\u8eac\u516c\u5bab\u5f13\u5de9\u6c5e\u62f1\u8d21\u5171\u857b\u5efe\u54a3\u73d9\u80b1\u86a3\u86e9\u89e5",  
            "gao": "\u7bd9\u768b\u9ad8\u818f\u7f94\u7cd5\u641e\u9550\u7a3f\u544a\u777e\u8bf0\u90dc\u84bf\u85c1\u7f1f\u69d4\u69c1\u6772\u9506",  
            "ge": "\u54e5\u6b4c\u6401\u6208\u9e3d\u80f3\u7599\u5272\u9769\u845b\u683c\u9601\u9694\u94ec\u4e2a\u5404\u9b32\u4ee1\u54ff\u5865\u55dd\u7ea5\u643f\u8188\u784c\u94ea\u9549\u88bc\u988c\u867c\u8238\u9abc\u9ac2",  
            "gei": "\u7ed9",  
            "gen": "\u6839\u8ddf\u4e98\u831b\u54cf\u826e",  
            "geng": "\u8015\u66f4\u5e9a\u7fb9\u57c2\u803f\u6897\u54fd\u8d53\u9ca0",  
            "gou": "\u94a9\u52fe\u6c9f\u82df\u72d7\u57a2\u6784\u8d2d\u591f\u4f5d\u8bdf\u5ca3\u9058\u5abe\u7f11\u89cf\u5f40\u9e32\u7b31\u7bdd\u97b2",  
            "gu": "\u8f9c\u83c7\u5495\u7b8d\u4f30\u6cbd\u5b64\u59d1\u9f13\u53e4\u86ca\u9aa8\u8c37\u80a1\u6545\u987e\u56fa\u96c7\u560f\u8bc2\u83f0\u54cc\u5d2e\u6c69\u688f\u8f71\u726f\u727f\u80cd\u81cc\u6bc2\u77bd\u7f5f\u94b4\u9522\u74e0\u9e2a\u9e44\u75fc\u86c4\u9164\u89da\u9cb4\u9ab0\u9e58",  
            "gua": "\u522e\u74dc\u5250\u5be1\u6302\u8902\u5366\u8bd6\u5471\u681d\u9e39",  
            "guai": "\u4e56\u62d0\u602a\u54d9",  
            "guan": "\u68fa\u5173\u5b98\u51a0\u89c2\u7ba1\u9986\u7f50\u60ef\u704c\u8d2f\u500c\u839e\u63bc\u6dab\u76e5\u9e73\u9ccf",  
            "guang": "\u5149\u5e7f\u901b\u72b7\u6844\u80f1\u7592",  
            "gui": "\u7470\u89c4\u572d\u7845\u5f52\u9f9f\u95fa\u8f68\u9b3c\u8be1\u7678\u6842\u67dc\u8dea\u8d35\u523d\u5326\u523f\u5e8b\u5b84\u59ab\u6867\u7085\u6677\u7688\u7c0b\u9c91\u9cdc",  
            "gun": "\u8f8a\u6eda\u68cd\u4e28\u886e\u7ef2\u78d9\u9ca7",  
            "guo": "\u9505\u90ed\u56fd\u679c\u88f9\u8fc7\u9998\u8803\u57da\u63b4\u5459\u56d7\u5e3c\u5d1e\u7313\u6901\u8662\u951e\u8052\u872e\u873e\u8748",  
            "ha": "\u54c8",  
            "hai": "\u9ab8\u5b69\u6d77\u6c26\u4ea5\u5bb3\u9a87\u54b4\u55e8\u988f\u91a2",  
            "han": "\u9163\u61a8\u90af\u97e9\u542b\u6db5\u5bd2\u51fd\u558a\u7f55\u7ff0\u64bc\u634d\u65f1\u61be\u608d\u710a\u6c57\u6c49\u9097\u83e1\u6496\u961a\u701a\u6657\u7113\u9894\u86b6\u9f3e",  
            "hen": "\u592f\u75d5\u5f88\u72e0\u6068",  
            "hang": "\u676d\u822a\u6c86\u7ed7\u73e9\u6841",  
            "hao": "\u58d5\u568e\u8c6a\u6beb\u90dd\u597d\u8017\u53f7\u6d69\u8585\u55e5\u5686\u6fe0\u704f\u660a\u7693\u98a2\u869d",  
            "he": "\u5475\u559d\u8377\u83cf\u6838\u79be\u548c\u4f55\u5408\u76d2\u8c89\u9602\u6cb3\u6db8\u8d6b\u8910\u9e64\u8d3a\u8bc3\u52be\u58d1\u85ff\u55d1\u55ec\u9616\u76cd\u86b5\u7fee",  
            "hei": "\u563f\u9ed1",  
            "heng": "\u54fc\u4ea8\u6a2a\u8861\u6052\u8a07\u8605",  
            "hong": "\u8f70\u54c4\u70d8\u8679\u9e3f\u6d2a\u5b8f\u5f18\u7ea2\u9ec9\u8ba7\u836d\u85a8\u95f3\u6cd3",  
            "hou": "\u5589\u4faf\u7334\u543c\u539a\u5019\u540e\u5820\u5f8c\u9005\u760a\u7bcc\u7cc7\u9c8e\u9aba",  
            "hu": "\u547c\u4e4e\u5ffd\u745a\u58f6\u846b\u80e1\u8774\u72d0\u7cca\u6e56\u5f27\u864e\u552c\u62a4\u4e92\u6caa\u6237\u51b1\u553f\u56eb\u5cb5\u7322\u6019\u60da\u6d52\u6ef9\u7425\u69f2\u8f77\u89f3\u70c0\u7173\u623d\u6248\u795c\u9e55\u9e71\u7b0f\u9190\u659b",  
            "hua": "\u82b1\u54d7\u534e\u733e\u6ed1\u753b\u5212\u5316\u8bdd\u5290\u6d4d\u9a85\u6866\u94e7\u7a1e",  
            "huai": "\u69d0\u5f8a\u6000\u6dee\u574f\u8fd8\u8e1d",  
            "huan": "\u6b22\u73af\u6853\u7f13\u6362\u60a3\u5524\u75ea\u8c62\u7115\u6da3\u5ba6\u5e7b\u90c7\u5942\u57b8\u64d0\u571c\u6d39\u6d63\u6f36\u5bf0\u902d\u7f33\u953e\u9ca9\u9b1f",  
            "huang": "\u8352\u614c\u9ec4\u78fa\u8757\u7c27\u7687\u51f0\u60f6\u714c\u6643\u5e4c\u604d\u8c0e\u968d\u5fa8\u6e5f\u6f62\u9051\u749c\u8093\u7640\u87e5\u7bc1\u9cc7",  
            "hui": "\u7070\u6325\u8f89\u5fbd\u6062\u86d4\u56de\u6bc1\u6094\u6167\u5349\u60e0\u6666\u8d3f\u79fd\u4f1a\u70e9\u6c47\u8bb3\u8bf2\u7ed8\u8bd9\u8334\u835f\u8559\u54d5\u5599\u96b3\u6d04\u5f57\u7f0b\u73f2\u6656\u605a\u867a\u87ea\u9ebe",  
            "hun": "\u8364\u660f\u5a5a\u9b42\u6d51\u6df7\u8be8\u9984\u960d\u6eb7\u7f17",  
            "huo": "\u8c41\u6d3b\u4f19\u706b\u83b7\u6216\u60d1\u970d\u8d27\u7978\u6509\u56af\u5925\u94ac\u952a\u956c\u8020\u8816",  
            "ji": "\u51fb\u573e\u57fa\u673a\u7578\u7a3d\u79ef\u7b95\u808c\u9965\u8ff9\u6fc0\u8ba5\u9e21\u59ec\u7ee9\u7f09\u5409\u6781\u68d8\u8f91\u7c4d\u96c6\u53ca\u6025\u75be\u6c72\u5373\u5ac9\u7ea7\u6324\u51e0\u810a\u5df1\u84df\u6280\u5180\u5b63\u4f0e\u796d\u5242\u60b8\u6d4e\u5bc4\u5bc2\u8ba1\u8bb0\u65e2\u5fcc\u9645\u5993\u7ee7\u7eaa\u5c45\u4e0c\u4e69\u525e\u4f76\u4f74\u8114\u58bc\u82a8\u82b0\u8401\u84ba\u857a\u638e\u53fd\u54ad\u54dc\u5527\u5c8c\u5d74\u6d0e\u5f50\u5c50\u9aa5\u757f\u7391\u696b\u6b9b\u621f\u6222\u8d4d\u89ca\u7284\u9f51\u77f6\u7f81\u5d47\u7a37\u7620\u7635\u866e\u7b08\u7b04\u66a8\u8dfb\u8dfd\u9701\u9c9a\u9cab\u9afb\u9e82",  
            "jia": "\u5609\u67b7\u5939\u4f73\u5bb6\u52a0\u835a\u988a\u8d3e\u7532\u94be\u5047\u7a3c\u4ef7\u67b6\u9a7e\u5ac1\u4f3d\u90cf\u62ee\u5cac\u6d43\u8fe6\u73c8\u621b\u80db\u605d\u94d7\u9553\u75c2\u86f1\u7b33\u8888\u8dcf",  
            "jian": "\u6b7c\u76d1\u575a\u5c16\u7b3a\u95f4\u714e\u517c\u80a9\u8270\u5978\u7f04\u8327\u68c0\u67ec\u78b1\u7877\u62e3\u6361\u7b80\u4fed\u526a\u51cf\u8350\u69db\u9274\u8df5\u8d31\u89c1\u952e\u7bad\u4ef6\u5065\u8230\u5251\u996f\u6e10\u6e85\u6da7\u5efa\u50ed\u8c0f\u8c2b\u83c5\u84b9\u641b\u56dd\u6e54\u8e47\u8b07\u7f23\u67a7\u67d9\u6957\u620b\u622c\u726e\u728d\u6bfd\u8171\u7751\u950f\u9e63\u88e5\u7b15\u7bb4\u7fe6\u8dbc\u8e3a\u9ca3\u97af",  
            "jiang": "\u50f5\u59dc\u5c06\u6d46\u6c5f\u7586\u848b\u6868\u5956\u8bb2\u5320\u9171\u964d\u8333\u6d1a\u7edb\u7f30\u729f\u7913\u8029\u7ce8\u8c47",  
            "jiao": "\u8549\u6912\u7901\u7126\u80f6\u4ea4\u90ca\u6d47\u9a84\u5a07\u56bc\u6405\u94f0\u77eb\u4fa5\u811a\u72e1\u89d2\u997a\u7f34\u7ede\u527f\u6559\u9175\u8f7f\u8f83\u53eb\u4f7c\u50ec\u832d\u6322\u564d\u5ce4\u5fbc\u59e3\u7e9f\u656b\u768e\u9e6a\u86df\u91ae\u8de4\u9c9b",  
            "jie": "\u7a96\u63ed\u63a5\u7686\u79f8\u8857\u9636\u622a\u52ab\u8282\u6854\u6770\u6377\u776b\u7aed\u6d01\u7ed3\u89e3\u59d0\u6212\u85c9\u82a5\u754c\u501f\u4ecb\u75a5\u8beb\u5c4a\u5048\u8ba6\u8bd8\u5588\u55df\u736c\u5a55\u5b51\u6840\u7352\u78a3\u9534\u7596\u88b7\u9889\u86a7\u7faf\u9c92\u9ab1\u9aeb",  
            "jin": "\u5dfe\u7b4b\u65a4\u91d1\u4eca\u6d25\u895f\u7d27\u9526\u4ec5\u8c28\u8fdb\u9773\u664b\u7981\u8fd1\u70ec\u6d78\u5c3d\u537a\u8369\u5807\u5664\u9991\u5ed1\u5997\u7f19\u747e\u69ff\u8d46\u89d0\u9485\u9513\u887f\u77dc",  
            "jing": "\u52b2\u8346\u5162\u830e\u775b\u6676\u9cb8\u4eac\u60ca\u7cbe\u7cb3\u7ecf\u4e95\u8b66\u666f\u9888\u9759\u5883\u656c\u955c\u5f84\u75c9\u9756\u7adf\u7ade\u51c0\u522d\u5106\u9631\u83c1\u734d\u61ac\u6cfe\u8ff3\u5f2a\u5a67\u80bc\u80eb\u8148\u65cc",  
            "jiong": "\u70af\u7a98\u5182\u8fe5\u6243",  
            "jiu": "\u63ea\u7a76\u7ea0\u7396\u97ed\u4e45\u7078\u4e5d\u9152\u53a9\u6551\u65e7\u81fc\u8205\u548e\u5c31\u759a\u50e6\u557e\u9604\u67e9\u6855\u9e6b\u8d73\u9b0f",  
            "ju": "\u97a0\u62d8\u72d9\u75bd\u9a79\u83ca\u5c40\u5480\u77e9\u4e3e\u6cae\u805a\u62d2\u636e\u5de8\u5177\u8ddd\u8e1e\u952f\u4ff1\u53e5\u60e7\u70ac\u5267\u5028\u8bb5\u82e3\u82f4\u8392\u63ac\u907d\u5c66\u741a\u67b8\u6910\u6998\u6989\u6a58\u728b\u98d3\u949c\u9514\u7aad\u88fe\u8d84\u91b5\u8e3d\u9f83\u96ce\u97ab",  
            "juan": "\u6350\u9e43\u5a1f\u5026\u7737\u5377\u7ee2\u9104\u72f7\u6d93\u684a\u8832\u9529\u954c\u96bd",  
            "jue": "\u6485\u652b\u6289\u6398\u5014\u7235\u89c9\u51b3\u8bc0\u7edd\u53a5\u5282\u8c32\u77cd\u8568\u5658\u5d1b\u7357\u5b53\u73cf\u6877\u6a5b\u721d\u9562\u8e76\u89d6",  
            "jun": "\u5747\u83cc\u94a7\u519b\u541b\u5cfb\u4fca\u7ae3\u6d5a\u90e1\u9a8f\u6343\u72fb\u76b2\u7b60\u9e87",  
            "ka": "\u5580\u5496\u5361\u4f67\u5494\u80e9",  
            "ke": "\u54af\u5777\u82db\u67ef\u68f5\u78d5\u9897\u79d1\u58f3\u54b3\u53ef\u6e34\u514b\u523b\u5ba2\u8bfe\u5ca2\u606a\u6e98\u9a92\u7f02\u73c2\u8f72\u6c2a\u778c\u94b6\u75b4\u7aa0\u874c\u9ac1",  
            "kai": "\u5f00\u63e9\u6977\u51ef\u6168\u5240\u57b2\u8488\u5ffe\u607a\u94e0\u950e",  
            "kan": "\u520a\u582a\u52d8\u574e\u780d\u770b\u4f83\u51f5\u83b0\u83b6\u6221\u9f9b\u77b0",  
            "kang": "\u5eb7\u6177\u7ce0\u625b\u6297\u4ea2\u7095\u5751\u4f09\u95f6\u94aa",  
            "kao": "\u8003\u62f7\u70e4\u9760\u5c3b\u6832\u7292\u94d0",  
            "ken": "\u80af\u5543\u57a6\u6073\u57a0\u88c9\u9880",  
            "keng": "\u542d\u5fd0\u94ff",  
            "kong": "\u7a7a\u6050\u5b54\u63a7\u5025\u5d06\u7b9c",  
            "kou": "\u62a0\u53e3\u6263\u5bc7\u82a4\u853b\u53e9\u770d\u7b58",  
            "ku": "\u67af\u54ed\u7a9f\u82e6\u9177\u5e93\u88e4\u5233\u5800\u55be\u7ed4\u9ab7",  
            "kua": "\u5938\u57ae\u630e\u8de8\u80ef\u4f89",  
            "kuai": "\u5757\u7b77\u4fa9\u5feb\u84af\u90d0\u8489\u72ef\u810d",  
            "kuan": "\u5bbd\u6b3e\u9acb",  
            "kuang": "\u5321\u7b50\u72c2\u6846\u77ff\u7736\u65f7\u51b5\u8bd3\u8bf3\u909d\u5739\u593c\u54d0\u7ea9\u8d36",  
            "kui": "\u4e8f\u76d4\u5cbf\u7aa5\u8475\u594e\u9b41\u5080\u9988\u6127\u6e83\u9997\u532e\u5914\u9697\u63c6\u55b9\u559f\u609d\u6126\u9615\u9035\u668c\u777d\u8069\u8770\u7bd1\u81fe\u8dec",  
            "kun": "\u5764\u6606\u6346\u56f0\u6083\u9603\u7428\u951f\u918c\u9cb2\u9ae1",  
            "kuo": "\u62ec\u6269\u5ed3\u9614\u86de",  
            "la": "\u5783\u62c9\u5587\u8721\u814a\u8fa3\u5566\u524c\u647a\u908b\u65ef\u782c\u760c",  
            "lai": "\u83b1\u6765\u8d56\u5d03\u5f95\u6d9e\u6fd1\u8d49\u7750\u94fc\u765e\u7c41",  
            "lan": "\u84dd\u5a6a\u680f\u62e6\u7bee\u9611\u5170\u6f9c\u8c30\u63fd\u89c8\u61d2\u7f06\u70c2\u6ee5\u5549\u5c9a\u61d4\u6f24\u6984\u6593\u7f71\u9567\u8934",  
            "lang": "\u7405\u6994\u72fc\u5eca\u90ce\u6717\u6d6a\u83a8\u8497\u5577\u9606\u9512\u7a02\u8782",  
            "lao": "\u635e\u52b3\u7262\u8001\u4f6c\u59e5\u916a\u70d9\u6d9d\u5520\u5d02\u6833\u94d1\u94f9\u75e8\u91aa",  
            "le": "\u52d2\u4e50\u808b\u4ec2\u53fb\u561e\u6cd0\u9cd3",  
            "lei": "\u96f7\u956d\u857e\u78ca\u7d2f\u5121\u5792\u64c2\u7c7b\u6cea\u7fb8\u8bd4\u837d\u54a7\u6f2f\u5ad8\u7f27\u6a91\u8012\u9179",  
            "ling": "\u68f1\u51b7\u62ce\u73b2\u83f1\u96f6\u9f84\u94c3\u4f36\u7f9a\u51cc\u7075\u9675\u5cad\u9886\u53e6\u4ee4\u9143\u5844\u82d3\u5464\u56f9\u6ce0\u7eeb\u67c3\u68c2\u74f4\u8046\u86c9\u7fce\u9cae",  
            "leng": "\u695e\u6123",  
            "li": "\u5398\u68a8\u7281\u9ece\u7bf1\u72f8\u79bb\u6f13\u7406\u674e\u91cc\u9ca4\u793c\u8389\u8354\u540f\u6817\u4e3d\u5389\u52b1\u783e\u5386\u5229\u5088\u4f8b\u4fd0\u75e2\u7acb\u7c92\u6ca5\u96b6\u529b\u7483\u54e9\u4fea\u4fda\u90e6\u575c\u82c8\u8385\u84e0\u85dc\u6369\u5456\u5533\u55b1\u7301\u6ea7\u6fa7\u9026\u5a0c\u5ae0\u9a8a\u7f21\u73de\u67a5\u680e\u8f79\u623e\u783a\u8a48\u7f79\u9502\u9e42\u75a0\u75ac\u86ce\u870a\u8821\u7b20\u7be5\u7c9d\u91b4\u8dde\u96f3\u9ca1\u9ce2\u9ee7",  
            "lian": "\u4fe9\u8054\u83b2\u8fde\u9570\u5ec9\u601c\u6d9f\u5e18\u655b\u8138\u94fe\u604b\u70bc\u7ec3\u631b\u8539\u5941\u6f4b\u6fc2\u5a08\u740f\u695d\u6b93\u81c1\u81a6\u88e2\u880a\u9ca2",  
            "liang": "\u7cae\u51c9\u6881\u7cb1\u826f\u4e24\u8f86\u91cf\u667e\u4eae\u8c05\u589a\u690b\u8e09\u9753\u9b49",  
            "liao": "\u64a9\u804a\u50da\u7597\u71ce\u5be5\u8fbd\u6f66\u4e86\u6482\u9563\u5ed6\u6599\u84fc\u5c25\u5639\u7360\u5bee\u7f2d\u948c\u9e69\u8022",  
            "lie": "\u5217\u88c2\u70c8\u52a3\u730e\u51bd\u57d2\u6d0c\u8d94\u8e90\u9b23",  
            "lin": "\u7433\u6797\u78f7\u9716\u4e34\u90bb\u9cde\u6dcb\u51db\u8d41\u541d\u853a\u5d99\u5eea\u9074\u6aa9\u8f9a\u77b5\u7cbc\u8e8f\u9e9f",  
            "liu": "\u6e9c\u7409\u69b4\u786b\u998f\u7559\u5218\u7624\u6d41\u67f3\u516d\u62a1\u507b\u848c\u6cd6\u6d4f\u905b\u9a9d\u7efa\u65d2\u7198\u950d\u954f\u9e68\u938f",  
            "long": "\u9f99\u804b\u5499\u7b3c\u7abf\u9686\u5784\u62e2\u9647\u5f04\u5785\u830f\u6cf7\u73d1\u680a\u80e7\u783b\u7643",  
            "lou": "\u697c\u5a04\u6402\u7bd3\u6f0f\u964b\u55bd\u5d5d\u9542\u7618\u8027\u877c\u9ac5",  
            "lu": "\u82a6\u5362\u9885\u5e90\u7089\u63b3\u5364\u864f\u9c81\u9e93\u788c\u9732\u8def\u8d42\u9e7f\u6f5e\u7984\u5f55\u9646\u622e\u5786\u6445\u64b8\u565c\u6cf8\u6e0c\u6f09\u7490\u680c\u6a79\u8f73\u8f82\u8f98\u6c07\u80ea\u9565\u9e2c\u9e6d\u7c0f\u823b\u9c88",  
            "lv": "\u9a74\u5415\u94dd\u4fa3\u65c5\u5c65\u5c61\u7f15\u8651\u6c2f\u5f8b\u7387\u6ee4\u7eff\u634b\u95fe\u6988\u8182\u7a06\u891b",  
            "luan": "\u5ce6\u5b6a\u6ee6\u5375\u4e71\u683e\u9e3e\u92ae",  
            "lue": "\u63a0\u7565\u950a",  
            "lun": "\u8f6e\u4f26\u4ed1\u6ca6\u7eb6\u8bba\u56f5",  
            "luo": "\u841d\u87ba\u7f57\u903b\u9523\u7ba9\u9aa1\u88f8\u843d\u6d1b\u9a86\u7edc\u502e\u8366\u645e\u7321\u6cfa\u6924\u8136\u9559\u7630\u96d2",  
            "ma": "\u5988\u9ebb\u739b\u7801\u8682\u9a6c\u9a82\u561b\u5417\u551b\u72b8\u5b37\u6769\u9ebd",  
            "mai": "\u57cb\u4e70\u9ea6\u5356\u8fc8\u8109\u52a2\u836c\u54aa\u973e",  
            "man": "\u7792\u9992\u86ee\u6ee1\u8513\u66fc\u6162\u6f2b\u8c29\u5881\u5e54\u7f26\u71b3\u9558\u989f\u87a8\u9cd7\u9794",  
            "mang": "\u8292\u832b\u76f2\u5fd9\u83bd\u9099\u6f2d\u6726\u786d\u87d2",  
            "meng": "\u6c13\u840c\u8499\u6aac\u76df\u9530\u731b\u68a6\u5b5f\u52d0\u750d\u77a2\u61f5\u791e\u867b\u8722\u8813\u824b\u8268\u9efe",  
            "miao": "\u732b\u82d7\u63cf\u7784\u85d0\u79d2\u6e3a\u5e99\u5999\u55b5\u9088\u7f08\u7f2a\u676a\u6dfc\u7707\u9e4b\u8731",  
            "mao": "\u8305\u951a\u6bdb\u77db\u94c6\u536f\u8302\u5192\u5e3d\u8c8c\u8d38\u4f94\u88a4\u52d6\u8306\u5cc1\u7441\u6634\u7266\u8004\u65c4\u61cb\u7780\u86d1\u8765\u87ca\u9ae6",  
            "me": "\u4e48",  
            "mei": "\u73ab\u679a\u6885\u9176\u9709\u7164\u6ca1\u7709\u5a92\u9541\u6bcf\u7f8e\u6627\u5bd0\u59b9\u5a9a\u5776\u8393\u5d4b\u7338\u6d7c\u6e44\u6963\u9545\u9e5b\u8882\u9b45",  
            "men": "\u95e8\u95f7\u4eec\u626a\u739f\u7116\u61d1\u9494",  
            "mi": "\u772f\u919a\u9761\u7cdc\u8ff7\u8c1c\u5f25\u7c73\u79d8\u89c5\u6ccc\u871c\u5bc6\u5e42\u8288\u5196\u8c27\u863c\u5627\u7315\u736f\u6c68\u5b93\u5f2d\u8112\u6549\u7cf8\u7e3b\u9e8b",  
            "mian": "\u68c9\u7720\u7ef5\u5195\u514d\u52c9\u5a29\u7f05\u9762\u6c94\u6e4e\u817c\u7704",  
            "mie": "\u8511\u706d\u54a9\u881b\u7bfe",  
            "min": "\u6c11\u62bf\u76bf\u654f\u60af\u95fd\u82e0\u5cb7\u95f5\u6cef\u73c9",  
            "ming": "\u660e\u879f\u9e23\u94ed\u540d\u547d\u51a5\u8317\u6e9f\u669d\u7791\u9169",  
            "miu": "\u8c2c",  
            "mo": "\u6478\u6479\u8611\u6a21\u819c\u78e8\u6469\u9b54\u62b9\u672b\u83ab\u58a8\u9ed8\u6cab\u6f20\u5bde\u964c\u8c1f\u8309\u84e6\u998d\u5aeb\u9546\u79e3\u763c\u8031\u87c6\u8c8a\u8c98",  
            "mou": "\u8c0b\u725f\u67d0\u53b6\u54de\u5a7a\u7738\u936a",  
            "mu": "\u62c7\u7261\u4ea9\u59c6\u6bcd\u5893\u66ae\u5e55\u52df\u6155\u6728\u76ee\u7766\u7267\u7a46\u4eeb\u82dc\u5452\u6c90\u6bea\u94bc",  
            "na": "\u62ff\u54ea\u5450\u94a0\u90a3\u5a1c\u7eb3\u5185\u637a\u80ad\u954e\u8872\u7bac",  
            "nai": "\u6c16\u4e43\u5976\u8010\u5948\u9f10\u827f\u8418\u67f0",  
            "nan": "\u5357\u7537\u96be\u56ca\u5583\u56e1\u6960\u8169\u877b\u8d67",  
            "nao": "\u6320\u8111\u607c\u95f9\u5b6c\u57b4\u7331\u7459\u7847\u94d9\u86f2",  
            "ne": "\u6dd6\u5462\u8bb7",  
            "nei": "\u9981",  
            "nen": "\u5ae9\u80fd\u6798\u6041",  
            "ni": "\u59ae\u9713\u502a\u6ce5\u5c3c\u62df\u4f60\u533f\u817b\u9006\u6eba\u4f32\u576d\u730a\u6029\u6ee0\u6635\u65ce\u7962\u615d\u7768\u94cc\u9cb5",  
            "nian": "\u852b\u62c8\u5e74\u78be\u64b5\u637b\u5ff5\u5eff\u8f87\u9ecf\u9c87\u9cb6",  
            "niang": "\u5a18\u917f",  
            "niao": "\u9e1f\u5c3f\u8311\u5b32\u8132\u8885",  
            "nie": "\u634f\u8042\u5b7d\u556e\u954a\u954d\u6d85\u4e5c\u9667\u8616\u55eb\u8080\u989e\u81ec\u8e51",  
            "nin": "\u60a8\u67e0",  
            "ning": "\u72de\u51dd\u5b81\u62e7\u6cde\u4f5e\u84e5\u549b\u752f\u804d",  
            "niu": "\u725b\u626d\u94ae\u7ebd\u72c3\u5ff8\u599e\u86b4",  
            "nong": "\u8113\u6d53\u519c\u4fac",  
            "nu": "\u5974\u52aa\u6012\u5476\u5e11\u5f29\u80ec\u5b65\u9a7d",  
            "nv": "\u5973\u6067\u9495\u8844",  
            "nuan": "\u6696",  
            "nuenue": "\u8650",  
            "nue": "\u759f\u8c11",  
            "nuo": "\u632a\u61e6\u7cef\u8bfa\u50a9\u6426\u558f\u9518",  
            "ou": "\u54e6\u6b27\u9e25\u6bb4\u85d5\u5455\u5076\u6ca4\u6004\u74ef\u8026",  
            "pa": "\u556a\u8db4\u722c\u5e15\u6015\u7436\u8469\u7b62",  
            "pai": "\u62cd\u6392\u724c\u5f98\u6e43\u6d3e\u4ff3\u848e",  
            "pan": "\u6500\u6f58\u76d8\u78d0\u76fc\u7554\u5224\u53db\u723f\u6cee\u88a2\u897b\u87e0\u8e52",  
            "pang": "\u4e53\u5e9e\u65c1\u802a\u80d6\u6ec2\u9004",  
            "pao": "\u629b\u5486\u5228\u70ae\u888d\u8dd1\u6ce1\u530f\u72cd\u5e96\u812c\u75b1",  
            "pei": "\u5478\u80da\u57f9\u88f4\u8d54\u966a\u914d\u4f69\u6c9b\u638a\u8f94\u5e14\u6de0\u65c6\u952b\u9185\u9708",  
            "pen": "\u55b7\u76c6\u6e53",  
            "peng": "\u7830\u62a8\u70f9\u6f8e\u5f6d\u84ec\u68da\u787c\u7bf7\u81a8\u670b\u9e4f\u6367\u78b0\u576f\u580b\u562d\u6026\u87db",  
            "pi": "\u7812\u9739\u6279\u62ab\u5288\u7435\u6bd7\u5564\u813e\u75b2\u76ae\u5339\u75de\u50fb\u5c41\u8b6c\u4e15\u9674\u90b3\u90eb\u572e\u9f19\u64d7\u567c\u5e80\u5ab2\u7eb0\u6787\u7513\u7765\u7f74\u94cd\u75e6\u7656\u758b\u868d\u8c94",  
            "pian": "\u7bc7\u504f\u7247\u9a97\u8c1d\u9a88\u728f\u80fc\u890a\u7fe9\u8e41",  
            "piao": "\u98d8\u6f02\u74e2\u7968\u527d\u560c\u5ad6\u7f25\u6b8d\u779f\u87b5",  
            "pie": "\u6487\u77a5\u4e3f\u82e4\u6c15",  
            "pin": "\u62fc\u9891\u8d2b\u54c1\u8058\u62da\u59d8\u5ad4\u6980\u725d\u98a6",  
            "ping": "\u4e52\u576a\u82f9\u840d\u5e73\u51ed\u74f6\u8bc4\u5c4f\u4fdc\u5a09\u67b0\u9c86",  
            "po": "\u5761\u6cfc\u9887\u5a46\u7834\u9b44\u8feb\u7c95\u53f5\u9131\u6ea5\u73c0\u948b\u94b7\u76a4\u7b38",  
            "pou": "\u5256\u88d2\u8e23",  
            "pu": "\u6251\u94fa\u4ec6\u8386\u8461\u83e9\u84b2\u57d4\u6734\u5703\u666e\u6d66\u8c31\u66dd\u7011\u530d\u5657\u6fee\u749e\u6c06\u9564\u9568\u8e7c",  
            "qi": "\u671f\u6b3a\u6816\u621a\u59bb\u4e03\u51c4\u6f06\u67d2\u6c8f\u5176\u68cb\u5947\u6b67\u7566\u5d0e\u8110\u9f50\u65d7\u7948\u7941\u9a91\u8d77\u5c82\u4e5e\u4f01\u542f\u5951\u780c\u5668\u6c14\u8fc4\u5f03\u6c7d\u6ce3\u8bab\u4e9f\u4e93\u573b\u8291\u840b\u847a\u5601\u5c7a\u5c90\u6c54\u6dc7\u9a90\u7eee\u742a\u7426\u675e\u6864\u69ed\u6b39\u797a\u61a9\u789b\u86f4\u871e\u7da6\u7dae\u8dbf\u8e4a\u9ccd\u9e92",  
            "qia": "\u6390\u6070\u6d3d\u845c",  
            "qian": "\u7275\u6266\u948e\u94c5\u5343\u8fc1\u7b7e\u4edf\u8c26\u4e7e\u9ed4\u94b1\u94b3\u524d\u6f5c\u9063\u6d45\u8c34\u5811\u5d4c\u6b20\u6b49\u4f65\u9621\u828a\u82a1\u8368\u63ae\u5c8d\u60ad\u614a\u9a9e\u6434\u8930\u7f31\u6920\u80b7\u6106\u94a4\u8654\u7b9d",  
            "qiang": "\u67aa\u545b\u8154\u7f8c\u5899\u8537\u5f3a\u62a2\u5af1\u6a2f\u6217\u709d\u9516\u9535\u956a\u8941\u8723\u7f9f\u8deb\u8dc4",  
            "qiao": "\u6a47\u9539\u6572\u6084\u6865\u77a7\u4e54\u4fa8\u5de7\u9798\u64ac\u7fd8\u5ced\u4fcf\u7a8d\u5281\u8bee\u8c2f\u835e\u6100\u6194\u7f32\u6a35\u6bf3\u7857\u8df7\u9792",  
            "qie": "\u5207\u8304\u4e14\u602f\u7a83\u90c4\u553c\u60ec\u59be\u6308\u9532\u7ba7",  
            "qin": "\u94a6\u4fb5\u4eb2\u79e6\u7434\u52e4\u82b9\u64d2\u79bd\u5bdd\u6c81\u82a9\u84c1\u8572\u63ff\u5423\u55ea\u5659\u6eb1\u6a8e\u8793\u887e",  
            "qing": "\u9752\u8f7b\u6c22\u503e\u537f\u6e05\u64ce\u6674\u6c30\u60c5\u9877\u8bf7\u5e86\u5029\u82d8\u570a\u6aa0\u78ec\u873b\u7f44\u7b90\u8b26\u9cad\u9ee5",  
            "qiong": "\u743c\u7a77\u909b\u8315\u7a79\u7b47\u928e",  
            "qiu": "\u79cb\u4e18\u90b1\u7403\u6c42\u56da\u914b\u6cc5\u4fc5\u6c3d\u5def\u827d\u72b0\u6e6b\u9011\u9052\u6978\u8d47\u9e20\u866c\u86af\u8764\u88d8\u7cd7\u9cc5\u9f3d",  
            "qu": "\u8d8b\u533a\u86c6\u66f2\u8eaf\u5c48\u9a71\u6e20\u53d6\u5a36\u9f8b\u8da3\u53bb\u8bce\u52ac\u8556\u8627\u5c96\u8862\u9612\u74a9\u89d1\u6c0d\u795b\u78f2\u766f\u86d0\u883c\u9eb4\u77bf\u9ee2",  
            "quan": "\u5708\u98a7\u6743\u919b\u6cc9\u5168\u75ca\u62f3\u72ac\u5238\u529d\u8be0\u8343\u737e\u609b\u7efb\u8f81\u754e\u94e8\u8737\u7b4c\u9b08",  
            "que": "\u7f3a\u7094\u7638\u5374\u9e4a\u69b7\u786e\u96c0\u9619\u60ab",  
            "qun": "\u88d9\u7fa4\u9021",  
            "ran": "\u7136\u71c3\u5189\u67d3\u82d2\u9aef",  
            "rang": "\u74e4\u58e4\u6518\u56b7\u8ba9\u79b3\u7a70",  
            "rao": "\u9976\u6270\u7ed5\u835b\u5a06\u6861",  
            "ruo": "\u60f9\u82e5\u5f31",  
            "re": "\u70ed\u504c",  
            "ren": "\u58ec\u4ec1\u4eba\u5fcd\u97e7\u4efb\u8ba4\u5203\u598a\u7eab\u4ede\u834f\u845a\u996a\u8f6b\u7a14\u887d",  
            "reng": "\u6254\u4ecd",  
            "ri": "\u65e5",  
            "rong": "\u620e\u8338\u84c9\u8363\u878d\u7194\u6eb6\u5bb9\u7ed2\u5197\u5d58\u72e8\u7f1b\u6995\u877e",  
            "rou": "\u63c9\u67d4\u8089\u7cc5\u8e42\u97a3",  
            "ru": "\u8339\u8815\u5112\u5b7a\u5982\u8fb1\u4e73\u6c5d\u5165\u8925\u84d0\u85b7\u5685\u6d33\u6ebd\u6fe1\u94f7\u8966\u98a5",  
            "ruan": "\u8f6f\u962e\u670a",  
            "rui": "\u854a\u745e\u9510\u82ae\u8564\u777f\u868b",  
            "run": "\u95f0\u6da6",  
            "sa": "\u6492\u6d12\u8428\u5345\u4ee8\u6332\u98d2",  
            "sai": "\u816e\u9cc3\u585e\u8d5b\u567b",  
            "san": "\u4e09\u53c1\u4f1e\u6563\u5f61\u9993\u6c35\u6bf5\u7cc1\u9730",  
            "sang": "\u6851\u55d3\u4e27\u6421\u78c9\u98a1",  
            "sao": "\u6414\u9a9a\u626b\u5ac2\u57fd\u81ca\u7619\u9ccb",  
            "se": "\u745f\u8272\u6da9\u556c\u94e9\u94ef\u7a51",  
            "sen": "\u68ee",  
            "seng": "\u50e7",  
            "sha": "\u838e\u7802\u6740\u5239\u6c99\u7eb1\u50bb\u5565\u715e\u810e\u6b43\u75e7\u88df\u970e\u9ca8",  
            "shai": "\u7b5b\u6652\u917e",  
            "shan": "\u73ca\u82eb\u6749\u5c71\u5220\u717d\u886b\u95ea\u9655\u64c5\u8d61\u81b3\u5584\u6c55\u6247\u7f2e\u5261\u8baa\u912f\u57cf\u829f\u6f78\u59d7\u9a9f\u81bb\u9490\u759d\u87ee\u8222\u8dda\u9cdd",  
            "shang": "\u5892\u4f24\u5546\u8d4f\u664c\u4e0a\u5c1a\u88f3\u57a7\u7ef1\u6b87\u71b5\u89de",  
            "shao": "\u68a2\u634e\u7a0d\u70e7\u828d\u52fa\u97f6\u5c11\u54e8\u90b5\u7ecd\u52ad\u82d5\u6f72\u86f8\u7b24\u7b72\u8244",  
            "she": "\u5962\u8d4a\u86c7\u820c\u820d\u8d66\u6444\u5c04\u6151\u6d89\u793e\u8bbe\u538d\u4f58\u731e\u7572\u9e9d",  
            "shen": "\u7837\u7533\u547b\u4f38\u8eab\u6df1\u5a20\u7ec5\u795e\u6c88\u5ba1\u5a76\u751a\u80be\u614e\u6e17\u8bdc\u8c02\u5432\u54c2\u6e16\u6939\u77e7\u8703",  
            "sheng": "\u58f0\u751f\u7525\u7272\u5347\u7ef3\u7701\u76db\u5269\u80dc\u5723\u4e1e\u6e11\u5ab5\u771a\u7b19",  
            "shi": "\u5e08\u5931\u72ee\u65bd\u6e7f\u8bd7\u5c38\u8671\u5341\u77f3\u62fe\u65f6\u4ec0\u98df\u8680\u5b9e\u8bc6\u53f2\u77e2\u4f7f\u5c4e\u9a76\u59cb\u5f0f\u793a\u58eb\u4e16\u67ff\u4e8b\u62ed\u8a93\u901d\u52bf\u662f\u55dc\u566c\u9002\u4ed5\u4f8d\u91ca\u9970\u6c0f\u5e02\u6043\u5ba4\u89c6\u8bd5\u8c25\u57d8\u83b3\u84cd\u5f11\u5511\u9963\u8f7c\u8006\u8d33\u70bb\u793b\u94c8\u94ca\u87ab\u8210\u7b6e\u8c55\u9ca5\u9cba",  
            "shou": "\u6536\u624b\u9996\u5b88\u5bff\u6388\u552e\u53d7\u7626\u517d\u624c\u72e9\u7ef6\u824f",  
            "shu": "\u852c\u67a2\u68b3\u6b8a\u6292\u8f93\u53d4\u8212\u6dd1\u758f\u4e66\u8d4e\u5b70\u719f\u85af\u6691\u66d9\u7f72\u8700\u9ecd\u9f20\u5c5e\u672f\u8ff0\u6811\u675f\u620d\u7ad6\u5885\u5eb6\u6570\u6f31\u6055\u500f\u587e\u83fd\u5fc4\u6cad\u6d91\u6f8d\u59dd\u7ebe\u6bf9\u8167\u6bb3\u956f\u79eb\u9e6c",  
            "shua": "\u5237\u800d\u5530\u6dae",  
            "shuai": "\u6454\u8870\u7529\u5e05\u87c0",  
            "shuan": "\u6813\u62f4\u95e9",  
            "shuang": "\u971c\u53cc\u723d\u5b40",  
            "shui": "\u8c01\u6c34\u7761\u7a0e",  
            "shun": "\u542e\u77ac\u987a\u821c\u6042",  
            "shuo": "\u8bf4\u7855\u6714\u70c1\u84b4\u6420\u55cd\u6fef\u5981\u69ca\u94c4",  
            "si": "\u65af\u6495\u5636\u601d\u79c1\u53f8\u4e1d\u6b7b\u8086\u5bfa\u55e3\u56db\u4f3a\u4f3c\u9972\u5df3\u53ae\u4fdf\u5155\u83e5\u549d\u6c5c\u6cd7\u6f8c\u59d2\u9a77\u7f0c\u7940\u7960\u9536\u9e36\u801c\u86f3\u7b25",  
            "song": "\u677e\u8038\u6002\u9882\u9001\u5b8b\u8bbc\u8bf5\u51c7\u83d8\u5d27\u5d69\u5fea\u609a\u6dde\u7ae6",  
            "sou": "\u641c\u8258\u64de\u55fd\u53df\u55d6\u55fe\u998a\u6eb2\u98d5\u778d\u953c\u878b",  
            "su": "\u82cf\u9165\u4fd7\u7d20\u901f\u7c9f\u50f3\u5851\u6eaf\u5bbf\u8bc9\u8083\u5919\u8c21\u850c\u55c9\u612b\u7c0c\u89eb\u7a23",  
            "suan": "\u9178\u849c\u7b97",  
            "sui": "\u867d\u968b\u968f\u7ee5\u9ad3\u788e\u5c81\u7a57\u9042\u96a7\u795f\u84d1\u51ab\u8c07\u6fc9\u9083\u71e7\u772d\u7762",  
            "sun": "\u5b59\u635f\u7b0b\u836a\u72f2\u98e7\u69ab\u8de3\u96bc",  
            "suo": "\u68ad\u5506\u7f29\u7410\u7d22\u9501\u6240\u5522\u55e6\u5a11\u686b\u7743\u7fa7",  
            "ta": "\u584c\u4ed6\u5b83\u5979\u5854\u736d\u631e\u8e4b\u8e0f\u95fc\u6ebb\u9062\u69bb\u6c93",  
            "tai": "\u80ce\u82d4\u62ac\u53f0\u6cf0\u915e\u592a\u6001\u6c70\u90b0\u85b9\u80bd\u70b1\u949b\u8dc6\u9c90",  
            "tan": "\u574d\u644a\u8d2a\u762b\u6ee9\u575b\u6a80\u75f0\u6f6d\u8c2d\u8c08\u5766\u6bef\u8892\u78b3\u63a2\u53f9\u70ad\u90ef\u8548\u6619\u94bd\u952c\u8983",  
            "tang": "\u6c64\u5858\u642a\u5802\u68e0\u819b\u5510\u7cd6\u50a5\u9967\u6e8f\u746d\u94f4\u9557\u8025\u8797\u87b3\u7fb0\u91a3",  
            "thang": "\u5018\u8eba\u6dcc",  
            "theng": "\u8d9f\u70eb",  
            "tao": "\u638f\u6d9b\u6ed4\u7ee6\u8404\u6843\u9003\u6dd8\u9676\u8ba8\u5957\u6311\u9f17\u5555\u97ec\u9955",  
            "te": "\u7279",  
            "teng": "\u85e4\u817e\u75bc\u8a8a\u6ed5",  
            "ti": "\u68af\u5254\u8e22\u9511\u63d0\u9898\u8e44\u557c\u4f53\u66ff\u568f\u60d5\u6d95\u5243\u5c49\u8351\u608c\u9016\u7ee8\u7f07\u9e48\u88fc\u918d",  
            "tian": "\u5929\u6dfb\u586b\u7530\u751c\u606c\u8214\u8146\u63ad\u5fdd\u9617\u6b84\u754b\u94bf\u86ba",  
            "tiao": "\u6761\u8fe2\u773a\u8df3\u4f7b\u7967\u94eb\u7a95\u9f86\u9ca6",  
            "tie": "\u8d34\u94c1\u5e16\u841c\u992e",  
            "ting": "\u5385\u542c\u70c3\u6c40\u5ef7\u505c\u4ead\u5ead\u633a\u8247\u839b\u8476\u5a77\u6883\u8713\u9706",  
            "tong": "\u901a\u6850\u916e\u77b3\u540c\u94dc\u5f64\u7ae5\u6876\u6345\u7b52\u7edf\u75db\u4f5f\u50ee\u4edd\u833c\u55f5\u6078\u6f7c\u783c",  
            "tou": "\u5077\u6295\u5934\u900f\u4ea0",  
            "tu": "\u51f8\u79c3\u7a81\u56fe\u5f92\u9014\u6d82\u5c60\u571f\u5410\u5154\u580d\u837c\u83df\u948d\u9174",  
            "tuan": "\u6e4d\u56e2\u7583",  
            "tui": "\u63a8\u9893\u817f\u8715\u892a\u9000\u5fd2\u717a",  
            "tun": "\u541e\u5c6f\u81c0\u9968\u66be\u8c5a\u7a80",  
            "tuo": "\u62d6\u6258\u8131\u9e35\u9640\u9a6e\u9a7c\u692d\u59a5\u62d3\u553e\u4e47\u4f57\u5768\u5eb9\u6cb1\u67dd\u7823\u7ba8\u8204\u8dce\u9f0d",  
            "wa": "\u6316\u54c7\u86d9\u6d3c\u5a03\u74e6\u889c\u4f64\u5a32\u817d",  
            "wai": "\u6b6a\u5916",  
            "wan": "\u8c4c\u5f2f\u6e7e\u73a9\u987d\u4e38\u70f7\u5b8c\u7897\u633d\u665a\u7696\u60cb\u5b9b\u5a49\u4e07\u8155\u525c\u8284\u82cb\u83c0\u7ea8\u7efe\u742c\u8118\u7579\u873f\u7ba2",  
            "wang": "\u6c6a\u738b\u4ea1\u6789\u7f51\u5f80\u65fa\u671b\u5fd8\u5984\u7f54\u5c22\u60d8\u8f8b\u9b4d",  
            "wei": "\u5a01\u5dcd\u5fae\u5371\u97e6\u8fdd\u6845\u56f4\u552f\u60df\u4e3a\u6f4d\u7ef4\u82c7\u840e\u59d4\u4f1f\u4f2a\u5c3e\u7eac\u672a\u851a\u5473\u754f\u80c3\u5582\u9b4f\u4f4d\u6e2d\u8c13\u5c09\u6170\u536b\u502d\u504e\u8bff\u9688\u8473\u8587\u5e0f\u5e37\u5d34\u5d6c\u7325\u732c\u95f1\u6ca9\u6d27\u6da0\u9036\u5a13\u73ae\u97ea\u8ece\u709c\u7168\u71a8\u75ff\u8249\u9c94",  
            "wen": "\u761f\u6e29\u868a\u6587\u95fb\u7eb9\u543b\u7a33\u7d0a\u95ee\u520e\u6120\u960c\u6c76\u74ba\u97eb\u6b81\u96ef",  
            "weng": "\u55e1\u7fc1\u74ee\u84ca\u8579",  
            "wo": "\u631d\u8717\u6da1\u7a9d\u6211\u65a1\u5367\u63e1\u6c83\u83b4\u5e44\u6e25\u674c\u809f\u9f8c",  
            "wu": "\u5deb\u545c\u94a8\u4e4c\u6c61\u8bec\u5c4b\u65e0\u829c\u68a7\u543e\u5434\u6bcb\u6b66\u4e94\u6342\u5348\u821e\u4f0d\u4fae\u575e\u620a\u96fe\u6664\u7269\u52ff\u52a1\u609f\u8bef\u5140\u4ef5\u9622\u90ac\u572c\u82b4\u5e91\u6003\u5fe4\u6d6f\u5be4\u8fd5\u59a9\u9a9b\u727e\u7110\u9e49\u9e5c\u8708\u92c8\u9f2f",  
            "xi": "\u6614\u7199\u6790\u897f\u7852\u77fd\u6670\u563b\u5438\u9521\u727a\u7a00\u606f\u5e0c\u6089\u819d\u5915\u60dc\u7184\u70ef\u6eaa\u6c50\u7280\u6a84\u88ad\u5e2d\u4e60\u5ab3\u559c\u94e3\u6d17\u7cfb\u9699\u620f\u7ec6\u50d6\u516e\u96b0\u90d7\u831c\u8478\u84f0\u595a\u550f\u5f99\u9969\u960b\u6d60\u6dc5\u5c63\u5b09\u73ba\u6a28\u66e6\u89cb\u6b37\u71b9\u798a\u79a7\u94b8\u7699\u7a78\u8725\u87cb\u823e\u7fb2\u7c9e\u7fd5\u91af\u9f37",  
            "xia": "\u778e\u867e\u5323\u971e\u8f96\u6687\u5ce1\u4fa0\u72ed\u4e0b\u53a6\u590f\u5413\u6380\u846d\u55c4\u72ce\u9050\u7455\u7856\u7615\u7f45\u9ee0",  
            "xian": "\u9528\u5148\u4ed9\u9c9c\u7ea4\u54b8\u8d24\u8854\u8237\u95f2\u6d8e\u5f26\u5acc\u663e\u9669\u73b0\u732e\u53bf\u817a\u9985\u7fa1\u5baa\u9677\u9650\u7ebf\u51bc\u85d3\u5c98\u7303\u66b9\u5a34\u6c19\u7946\u9e47\u75eb\u86ac\u7b45\u7c7c\u9170\u8df9",  
            "xiang": "\u76f8\u53a2\u9576\u9999\u7bb1\u8944\u6e58\u4e61\u7fd4\u7965\u8be6\u60f3\u54cd\u4eab\u9879\u5df7\u6a61\u50cf\u5411\u8c61\u8297\u8459\u9977\u5ea0\u9aa7\u7f03\u87d3\u9c9e\u98e8",  
            "xiao": "\u8427\u785d\u9704\u524a\u54ee\u56a3\u9500\u6d88\u5bb5\u6dc6\u6653\u5c0f\u5b5d\u6821\u8096\u5578\u7b11\u6548\u54d3\u54bb\u5d24\u6f47\u900d\u9a81\u7ee1\u67ad\u67b5\u7b71\u7bab\u9b48",  
            "xie": "\u6954\u4e9b\u6b47\u874e\u978b\u534f\u631f\u643a\u90aa\u659c\u80c1\u8c10\u5199\u68b0\u5378\u87f9\u61c8\u6cc4\u6cfb\u8c22\u5c51\u5055\u4eb5\u52f0\u71ee\u85a4\u64b7\u5ee8\u7023\u9082\u7ec1\u7f2c\u69ad\u698d\u6b59\u8e9e",  
            "xin": "\u85aa\u82af\u950c\u6b23\u8f9b\u65b0\u5ffb\u5fc3\u4fe1\u8845\u56df\u99a8\u8398\u6b46\u94fd\u946b",  
            "xing": "\u661f\u8165\u7329\u60fa\u5174\u5211\u578b\u5f62\u90a2\u884c\u9192\u5e78\u674f\u6027\u59d3\u9649\u8347\u8365\u64e4\u60bb\u784e",  
            "xiong": "\u5144\u51f6\u80f8\u5308\u6c79\u96c4\u718a\u828e",  
            "xiu": "\u4f11\u4fee\u7f9e\u673d\u55c5\u9508\u79c0\u8896\u7ee3\u83a0\u5cab\u9990\u5ea5\u9e3a\u8c85\u9af9",  
            "xu": "\u589f\u620c\u9700\u865a\u5618\u987b\u5f90\u8bb8\u84c4\u9157\u53d9\u65ed\u5e8f\u755c\u6064\u7d6e\u5a7f\u7eea\u7eed\u8bb4\u8be9\u5729\u84ff\u6035\u6d2b\u6e86\u987c\u6829\u7166\u7809\u76f1\u80e5\u7cc8\u9191",  
            "xuan": "\u8f69\u55a7\u5ba3\u60ac\u65cb\u7384\u9009\u7663\u7729\u7eda\u5107\u8c16\u8431\u63ce\u9994\u6ceb\u6d35\u6e32\u6f29\u7487\u6966\u6684\u70ab\u714a\u78b9\u94c9\u955f\u75c3",  
            "xue": "\u9774\u859b\u5b66\u7a74\u96ea\u8840\u5671\u6cf6\u9cd5",  
            "xun": "\u52cb\u718f\u5faa\u65ec\u8be2\u5bfb\u9a6f\u5de1\u6b89\u6c5b\u8bad\u8baf\u900a\u8fc5\u5dfd\u57d9\u8340\u85b0\u5ccb\u5f87\u6d54\u66db\u7aa8\u91ba\u9c9f",  
            "ya": "\u538b\u62bc\u9e26\u9e2d\u5440\u4e2b\u82bd\u7259\u869c\u5d16\u8859\u6daf\u96c5\u54d1\u4e9a\u8bb6\u4f22\u63e0\u5416\u5c88\u8fd3\u5a05\u740a\u6860\u6c29\u7811\u775a\u75d6",  
            "yan": "\u7109\u54bd\u9609\u70df\u6df9\u76d0\u4e25\u7814\u8712\u5ca9\u5ef6\u8a00\u989c\u960e\u708e\u6cbf\u5944\u63a9\u773c\u884d\u6f14\u8273\u5830\u71d5\u538c\u781a\u96c1\u5501\u5f66\u7130\u5bb4\u8c1a\u9a8c\u53a3\u9765\u8d5d\u4fe8\u5043\u5156\u8ba0\u8c33\u90fe\u9122\u82ab\u83f8\u5d26\u6079\u95eb\u960f\u6d07\u6e6e\u6edf\u598d\u5ae3\u7430\u664f\u80ed\u814c\u7131\u7f68\u7b75\u917d\u9b47\u990d\u9f39",  
            "yang": "\u6b83\u592e\u9e2f\u79e7\u6768\u626c\u4f6f\u75a1\u7f8a\u6d0b\u9633\u6c27\u4ef0\u75d2\u517b\u6837\u6f3e\u5f89\u600f\u6cf1\u7080\u70ca\u6059\u86d8\u9785",  
            "yao": "\u9080\u8170\u5996\u7476\u6447\u5c27\u9065\u7a91\u8c23\u59da\u54ac\u8200\u836f\u8981\u8000\u592d\u723b\u5406\u5d3e\u5fad\u7039\u5e7a\u73e7\u6773\u66dc\u80b4\u9e5e\u7a88\u7e47\u9cd0",  
            "ye": "\u6930\u564e\u8036\u7237\u91ce\u51b6\u4e5f\u9875\u6396\u4e1a\u53f6\u66f3\u814b\u591c\u6db2\u8c12\u90ba\u63f6\u9980\u6654\u70e8\u94d8",  
            "yi": "\u4e00\u58f9\u533b\u63d6\u94f1\u4f9d\u4f0a\u8863\u9890\u5937\u9057\u79fb\u4eea\u80f0\u7591\u6c82\u5b9c\u59e8\u5f5d\u6905\u8681\u501a\u5df2\u4e59\u77e3\u4ee5\u827a\u6291\u6613\u9091\u5c79\u4ebf\u5f79\u81c6\u9038\u8084\u75ab\u4ea6\u88d4\u610f\u6bc5\u5fc6\u4e49\u76ca\u6ea2\u8be3\u8bae\u8c0a\u8bd1\u5f02\u7ffc\u7fcc\u7ece\u5208\u5293\u4f7e\u8bd2\u572a\u572f\u57f8\u61ff\u82e1\u858f\u5f08\u5955\u6339\u5f0b\u5453\u54a6\u54bf\u566b\u5cc4\u5db7\u7317\u9974\u603f\u6021\u6092\u6f2a\u8fe4\u9a7f\u7f22\u6baa\u8d3b\u65d6\u71a0\u9487\u9552\u9571\u75cd\u7617\u7654\u7fca\u8864\u8734\u8223\u7fbf\u7ff3\u914f\u9edf",  
            "yin": "\u8335\u836b\u56e0\u6bb7\u97f3\u9634\u59fb\u541f\u94f6\u6deb\u5bc5\u996e\u5c39\u5f15\u9690\u5370\u80e4\u911e\u5819\u831a\u5591\u72fa\u5924\u6c24\u94df\u763e\u8693\u972a\u9f88",  
            "ying": "\u82f1\u6a31\u5a74\u9e70\u5e94\u7f28\u83b9\u8424\u8425\u8367\u8747\u8fce\u8d62\u76c8\u5f71\u9896\u786c\u6620\u5b34\u90e2\u8314\u83ba\u8426\u6484\u5624\u81ba\u6ee2\u6f46\u701b\u745b\u748e\u6979\u9e66\u763f\u988d\u7f42",  
            "yo": "\u54df\u5537",  
            "yong": "\u62e5\u4f63\u81c3\u75c8\u5eb8\u96cd\u8e0a\u86f9\u548f\u6cf3\u6d8c\u6c38\u607f\u52c7\u7528\u4fd1\u58c5\u5889\u6175\u9095\u955b\u752c\u9cd9\u9954",  
            "you": "\u5e7d\u4f18\u60a0\u5fe7\u5c24\u7531\u90ae\u94c0\u72b9\u6cb9\u6e38\u9149\u6709\u53cb\u53f3\u4f51\u91c9\u8bf1\u53c8\u5e7c\u5363\u6538\u4f91\u83b8\u5466\u56ff\u5ba5\u67da\u7337\u7256\u94d5\u75a3\u8763\u9c7f\u9edd\u9f2c",  
            "yu": "\u8fc2\u6de4\u4e8e\u76c2\u6986\u865e\u611a\u8206\u4f59\u4fde\u903e\u9c7c\u6109\u6e1d\u6e14\u9685\u4e88\u5a31\u96e8\u4e0e\u5c7f\u79b9\u5b87\u8bed\u7fbd\u7389\u57df\u828b\u90c1\u5401\u9047\u55bb\u5cea\u5fa1\u6108\u6b32\u72f1\u80b2\u8a89\u6d74\u5bd3\u88d5\u9884\u8c6b\u9a6d\u79ba\u6bd3\u4f1b\u4fe3\u8c00\u8c15\u8438\u84e3\u63c4\u5581\u5704\u5709\u5d5b\u72f3\u996b\u5ebe\u9608\u59aa\u59a4\u7ea1\u745c\u6631\u89ce\u8174\u6b24\u65bc\u715c\u71e0\u807f\u94b0\u9e46\u7610\u7600\u7ab3\u8753\u7afd\u8201\u96e9\u9f89",  
            "yuan": "\u9e33\u6e0a\u51a4\u5143\u57a3\u8881\u539f\u63f4\u8f95\u56ed\u5458\u5706\u733f\u6e90\u7f18\u8fdc\u82d1\u613f\u6028\u9662\u586c\u6c85\u5a9b\u7457\u6a7c\u7230\u7722\u9e22\u8788\u9f0b",  
            "yue": "\u66f0\u7ea6\u8d8a\u8dc3\u94a5\u5cb3\u7ca4\u6708\u60a6\u9605\u9fa0\u6a3e\u5216\u94ba",  
            "yun": "\u8018\u4e91\u90e7\u5300\u9668\u5141\u8fd0\u8574\u915d\u6655\u97f5\u5b55\u90d3\u82b8\u72c1\u607d\u7ead\u6b92\u6600\u6c32",  
            "za": "\u531d\u7838\u6742\u62f6\u5482",  
            "zai": "\u683d\u54c9\u707e\u5bb0\u8f7d\u518d\u5728\u54b1\u5d3d\u753e",  
            "zan": "\u6512\u6682\u8d5e\u74d2\u661d\u7c2a\u7ccc\u8db1\u933e",  
            "zang": "\u8d43\u810f\u846c\u5958\u6215\u81e7",  
            "zao": "\u906d\u7cdf\u51ff\u85fb\u67a3\u65e9\u6fa1\u86a4\u8e81\u566a\u9020\u7682\u7076\u71e5\u5523\u7f2b",  
            "ze": "\u8d23\u62e9\u5219\u6cfd\u4ec4\u8d5c\u5567\u8fee\u6603\u7b2e\u7ba6\u8234",  
            "zei": "\u8d3c",  
            "zen": "\u600e\u8c2e",  
            "zeng": "\u589e\u618e\u66fe\u8d60\u7f2f\u7511\u7f7e\u9503",  
            "zha": "\u624e\u55b3\u6e23\u672d\u8f67\u94e1\u95f8\u7728\u6805\u69a8\u548b\u4e4d\u70b8\u8bc8\u63f8\u5412\u54a4\u54f3\u600d\u781f\u75c4\u86b1\u9f44",  
            "zhai": "\u6458\u658b\u5b85\u7a84\u503a\u5be8\u7826",  
            "zhan": "\u77bb\u6be1\u8a79\u7c98\u6cbe\u76cf\u65a9\u8f97\u5d2d\u5c55\u8638\u6808\u5360\u6218\u7ad9\u6e5b\u7efd\u8c35\u640c\u65c3",  
            "zhang": "\u6a1f\u7ae0\u5f70\u6f33\u5f20\u638c\u6da8\u6756\u4e08\u5e10\u8d26\u4ed7\u80c0\u7634\u969c\u4ec9\u9123\u5e5b\u5d82\u7350\u5adc\u748b\u87d1",  
            "zhao": "\u62db\u662d\u627e\u6cbc\u8d75\u7167\u7f69\u5146\u8087\u53ec\u722a\u8bcf\u68f9\u948a\u7b0a",  
            "zhe": "\u906e\u6298\u54f2\u86f0\u8f99\u8005\u9517\u8517\u8fd9\u6d59\u8c2a\u966c\u67d8\u8f84\u78d4\u9e67\u891a\u8707\u8d6d",  
            "zhen": "\u73cd\u659f\u771f\u7504\u7827\u81fb\u8d1e\u9488\u4fa6\u6795\u75b9\u8bca\u9707\u632f\u9547\u9635\u7f1c\u6862\u699b\u8f78\u8d48\u80d7\u6715\u796f\u755b\u9e29",  
            "zheng": "\u84b8\u6323\u7741\u5f81\u72f0\u4e89\u6014\u6574\u62ef\u6b63\u653f\u5e27\u75c7\u90d1\u8bc1\u8be4\u5ce5\u94b2\u94ee\u7b5d",  
            "zhi": "\u829d\u679d\u652f\u5431\u8718\u77e5\u80a2\u8102\u6c41\u4e4b\u7ec7\u804c\u76f4\u690d\u6b96\u6267\u503c\u4f84\u5740\u6307\u6b62\u8dbe\u53ea\u65e8\u7eb8\u5fd7\u631a\u63b7\u81f3\u81f4\u7f6e\u5e1c\u5cd9\u5236\u667a\u79e9\u7a1a\u8d28\u7099\u75d4\u6ede\u6cbb\u7a92\u536e\u965f\u90c5\u57f4\u82b7\u646d\u5e19\u5fee\u5f58\u54ab\u9a98\u6809\u67b3\u6800\u684e\u8f75\u8f7e\u6534\u8d3d\u81a3\u7949\u7957\u9ef9\u96c9\u9e37\u75e3\u86ed\u7d77\u916f\u8dd6\u8e2c\u8e2f\u8c78\u89ef",  
            "zhong": "\u4e2d\u76c5\u5fe0\u949f\u8877\u7ec8\u79cd\u80bf\u91cd\u4ef2\u4f17\u51a2\u953a\u87bd\u8202\u822f\u8e35",  
            "zhou": "\u821f\u5468\u5dde\u6d32\u8bcc\u7ca5\u8f74\u8098\u5e1a\u5492\u76b1\u5b99\u663c\u9aa4\u5544\u7740\u501c\u8bf9\u836e\u9b3b\u7ea3\u80c4\u78a1\u7c40\u8233\u914e\u9cb7",  
            "zhu": "\u73e0\u682a\u86db\u6731\u732a\u8bf8\u8bdb\u9010\u7af9\u70db\u716e\u62c4\u77a9\u5631\u4e3b\u8457\u67f1\u52a9\u86c0\u8d2e\u94f8\u7b51\u4f4f\u6ce8\u795d\u9a7b\u4f2b\u4f8f\u90be\u82ce\u8331\u6d19\u6e1a\u6f74\u9a7a\u677c\u69e0\u6a65\u70b7\u94e2\u75b0\u7603\u86b0\u7afa\u7bb8\u7fe5\u8e85\u9e88",  
            "zhua": "\u6293",  
            "zhuai": "\u62fd",  
            "zhuan": "\u4e13\u7816\u8f6c\u64b0\u8d5a\u7bc6\u629f\u556d\u989b",  
            "zhuang": "\u6869\u5e84\u88c5\u5986\u649e\u58ee\u72b6\u4e2c",  
            "zhui": "\u690e\u9525\u8ffd\u8d58\u5760\u7f00\u8411\u9a93\u7f12",  
            "zhun": "\u8c06\u51c6",  
            "zhuo": "\u6349\u62d9\u5353\u684c\u7422\u8301\u914c\u707c\u6d4a\u502c\u8bfc\u5ef4\u855e\u64e2\u555c\u6d5e\u6dbf\u6753\u712f\u799a\u65ab",  
            "zi": "\u5179\u54a8\u8d44\u59ff\u6ecb\u6dc4\u5b5c\u7d2b\u4ed4\u7c7d\u6ed3\u5b50\u81ea\u6e0d\u5b57\u8c18\u5d6b\u59ca\u5b73\u7f01\u6893\u8f8e\u8d40\u6063\u7726\u9531\u79ed\u8014\u7b2b\u7ca2\u89dc\u8a3e\u9cbb\u9aed",  
            "zong": "\u9b03\u68d5\u8e2a\u5b97\u7efc\u603b\u7eb5\u8159\u7cbd",  
            "zou": "\u90b9\u8d70\u594f\u63cd\u9139\u9cb0",  
            "zu": "\u79df\u8db3\u5352\u65cf\u7956\u8bc5\u963b\u7ec4\u4fce\u83f9\u5550\u5f82\u9a75\u8e74",  
            "zuan": "\u94bb\u7e82\u6525\u7f35",  
            "zui": "\u5634\u9189\u6700\u7f6a",  
            "zun": "\u5c0a\u9075\u6499\u6a3d\u9cdf",  
            "zuo": "\u6628\u5de6\u4f50\u67de\u505a\u4f5c\u5750\u5ea7\u961d\u963c\u80d9\u795a\u9162",  
            "cou": "\u85ae\u6971\u8f8f\u8160",  
            "nang": "\u652e\u54dd\u56d4\u9995\u66e9",  
            "o": "\u5594",  
            "dia": "\u55f2",  
            "chuai": "\u562c\u81aa\u8e39",  
            "cen": "\u5c91\u6d94",  
            "diu": "\u94e5",  
            "nou": "\u8028",  
            "fou": "\u7f36",  
            "bia": "\u9adf"  
        }; 
        var l2 = char.length;  
        var I1 = "";  
        var reg = new RegExp('[a-zA-Z0-9\- ]');  
        for (var i = 0; i < l2; i++) {  
            var val = char.substr(i, 1);  
            var name = arraySearch(val, PinYin);  
            if (reg.test(val)) {  
                I1 += val;  
            } else if (name !== false) {  
                I1 += name;  
            }  
  
        }  
        I1 = I1.replace(/ /g, '-');  
        while (I1.indexOf('--') > 0) {  
            I1 = I1.replace('--', '-');  
        }  
        return I1; 
        function arraySearch(char) {  
            for (var name in PinYin) {  
                if (PinYin[name].indexOf(char) != -1) {  
                    return name;  
                    break;  
                }  
            }  
            return false;  
        } 
    },
    getAbsolute:function (reference, target) {//取元素的绝对坐标{left: left, right: right, top: top, bottom: bottom}
        //取一个元素相对于一个父元素的定位
        //reference-父元素$(".base")[0]
        //target-子元素$(this)[0]
        var result = {
            left: -target.clientLeft,
            top: -target.clientTop
        }
        var node = target;
        while(node != reference && node != document){
            result.left = result.left + node.offsetLeft + node.clientLeft;
            result.top = result.top + node.offsetTop + node.clientTop;
            node = node.parentNode;
        }
        if(isNaN(reference.scrollLeft)){
            result.right = document.documentElement.scrollWidth - result.left;
            result.bottom = document.documentElement.scrollHeight - result.top;
        }else {
            result.right = reference.scrollWidth - result.left;
            result.bottom = reference.scrollHeight - result.top;
        }
        return result;
    }
};
$(function () {
    mos._init();
    for(var i in mos._handleReady){
        var handle=mos._handleReady[i];
        handle();
    }
});
/*判断某变量是否为某数组中的一个值
 *用法如下：
 *var arr=new Array(["b",2,"a",4,"test"]);
 *arr.in_array('test');//判断 test 字符串是否存在于 arr 数组中，存在返回true 否则false
 *
 */
Array.prototype.in_array = function (element) {
　　for (var i = 0; i < this.length; i++) { 
    　　if (this[i] == element) {  
        　　return true;
        }
    } return false; 
}
/*mlayer*/
; !function(e, t) {
	"use strict";
	var i, n, a = e.mos && mos.define,
	o = {
		getPath: function() {
			var e = document.scripts,
			t = e[e.length - 1],
			i = t.src;
			if (!t.getAttribute("merge")) return i.substring(0, i.lastIndexOf("/") + 1)
		} (),
		config: {},
		end: {},
		minIndex: 0,
		minLeft: [],
		btn: ["&#x786E;&#x5B9A;", "&#x53D6;&#x6D88;"],
		type: ["dialog", "page", "iframe", "loading", "tips"]
	},
	r = {
		v: "0.1.1",
		ie: function() {
			var t = navigator.userAgent.toLowerCase();
			return !! (e.ActiveXObject || "ActiveXObject" in e) && ((t.match(/msie\s(\d+)/) || [])[1] || "11")
		} (),
		index: e.layer && e.layer.v ? 1e5: 0,
		path: o.getPath,
		config: function(e, t) {
			return e = e || {},
			r.cache = o.config = i.extend({},
			o.config, e),
			r.path = o.config.path || r.path,
			"string" == typeof e.extend && (e.extend = [e.extend]),
			o.config.path && r.ready()//,
			//e.extend ? (a ? layui.addcss("modules/layer/" + e.extend) : r.link("/" + e.extend), this) : this
		},
		link: function(t, n, a) {
			if (r.path) {
				var o = i("head")[0],
				s = document.createElement("link");
				"string" == typeof n && (a = n);
				var l = (a || t).replace(/\.|\//g, ""),
				f = "layuicss-" + l,
				c = 0;
				s.rel = "stylesheet",
				s.href = r.path + t,
				s.id = f,
				i("#" + f)[0] || o.appendChild(s),
				"function" == typeof n && !
				function u() {
					return++c > 80 ? e.console && console.error("layer.css: Invalid") : void(1989 === parseInt(i("#" + f).css("width")) ? n() : setTimeout(u, 100))
				} ()
			}
		},
		ready: function(e) {
			var t = "skinlayercss",
			i = "303";
			//return a ? layui.addcss("modules/layer/default/layer.css?v=" + r.v + i, e, t) : r.link("skin/default/layer.css?v=" + r.v + i, e, t),
			this
		},
		alert: function(e, t, n) {
			var a = "function" == typeof t;
			return a && (n = t),
			r.open(i.extend({
				content: e,
				yes: n
			},
			a ? {}: t))
		},
		confirm: function(e, t, n, a) {
			var s = "function" == typeof t;
			return s && (a = n, n = t),
			r.open(i.extend({
				content: e,
				btn: o.btn,
				yes: n,
				btn2: a
			},
			s ? {}: t))
		},
		msg: function(e, n, a) {
			var s = "function" == typeof n,
			f = o.config.skin,
			c = (f ? f + " " + f + "-msg": "") || "mlayer-msg",
			u = l.anim.length - 1;
			return s && (a = n),
			r.open(i.extend({
				content: e,
				time: 3e3,
				shade: !1,
				skin: c,
				title: !1,
				closeBtn: !1,
				btn: !1,
				resize: !1,
				end: a
			},
			s && !o.config.skin ? {
				skin: c + " mlayer-hui",
				anim: u
			}: function() {
				return n = n || {},
				(n.icon === -1 || n.icon === t && !o.config.skin) && (n.skin = c + " " + (n.skin || "mlayer-hui")),
				n
			} ()))
		},
		load: function(e, t) {
			return r.open(i.extend({
				type: 3,
				icon: e || 0,
				resize: !1,
				shade: .01
			},
			t))
		},
		tips: function(e, t, n) {
			return r.open(i.extend({
				type: 4,
				content: [e, t],
				closeBtn: !1,
				time: 3e3,
				shade: !1,
				resize: !1,
				fixed: !1,
				maxWidth: 210
			},
			n))
		}
	},
	s = function(e) {
		var t = this;
		t.index = ++r.index,
		t.config = i.extend({},
		t.config, o.config, e),
		document.body ? t.creat() : setTimeout(function() {
			t.creat()
		},
		30)
	};
	s.pt = s.prototype;
	var l = ["mlayer", ".mlayer-title", ".mlayer-main", ".mlayer-dialog", "mlayer-iframe", "mlayer-content", "mlayer-btn", "mlayer-close"];
	l.anim = ["layer-anim", "layer-anim-01", "layer-anim-02", "layer-anim-03", "layer-anim-04", "layer-anim-05", "layer-anim-06"],
	s.pt.config = {
		type: 0,
		shade: .3,
		fixed: !0,
		move: l[1],
        title: "&#x4FE1;&#x606F;",
        imgicon:"",
        iconclass:"",
        tadd:"",
        name:"",
        mlayertype:"",
		offset: "auto",
		area: "auto",
		closeBtn: 1,
		time: 0,
		zIndex: 19891014,
		maxWidth: 360,
		anim: 0,
		isOutAnim: !0,
		icon: -1,
		moveType: 1,
		resize: !0,
		scrollbar: !0,
		tips: 2
	},
	s.pt.vessel = function(e, t) {
		var n = this,
		a = n.index,
		r = n.config,
		s = r.zIndex + a,
		f = "object" == typeof r.title,
		c = r.maxmin && (1 === r.type || 2 === r.type),
		u = r.title ? '<div class="mlayer-title" style="' + (f ? r.title[1] : "") + '"><img class="'+r.iconclass+'" style="float:left;" src="'+ r.imgicon +'" />' + r.tadd +'<span class="mtitle">'+ (f ? r.title[0] : r.title) + "</span></div>": "";
		return r.zIndex = s,
		t([r.shade ? '<div class="mlayer-shade" id="mlayer-shade' + a + '" times="' + a + '" style="' + ("z-index:" + (s - 1) + "; background-color:" + (r.shade[1] || "#000") + "; opacity:" + (r.shade[0] || r.shade) + "; filter:alpha(opacity=" + (100 * r.shade[0] || 100 * r.shade) + ");") + '"></div>': "", '<div class="' + l[0] + (" mlayer-" + o.type[r.type]) + (0 != r.type && 2 != r.type || r.shade ? "": " mlayer-border") + " " + (r.skin || "") + '" id="' + l[0] + a + '" index="' + a + '" name="'+r.name+'" type="' + o.type[r.type] + '" times="' + a + '" showtime="' + r.time + '" conType="' + (e ? "object": "string") + '" mlayertype="'+r.mlayertype+'" style="z-index: ' + s + "; width:" + r.area[0] + ";height:" + r.area[1] + (r.fixed ? "": ";position:absolute;") + '">' + (e && 2 != r.type ? "": u) + /*<div id="' + (r.id || "") + '"*/'<div class="mlayer-content' + (0 == r.type && r.icon !== -1 ? " mlayer-padding": "") + (3 == r.type ? " mlayer-loading" + r.icon: "") + '">' + (0 == r.type && r.icon !== -1 ? '<i class="mlayer-ico mlayer-ico' + r.icon + '"></i>': "") + (1 == r.type && e ? "": r.content || "") + '</div><span class="mlayer-setwin">' +
		function() {
			var e = c ? '<a class="mlayer-min" style="cursor: default;" onclick="return false" title="'+mos.lang('最小化','minum')+'"><cite></cite></a><a style="cursor: default;" class="mlayer-ico mlayer-max"  onclick="return false" title="'+mos.lang('最大化','maxium')+'"></a>': "";
			return r.closeBtn && (e += '<a class="mlayer-ico ' + l[7] + " " + l[7] + (r.title ? r.closeBtn: 4 == r.type ? "1": "2") + '"  onclick="return false" title="'+mos.lang('关闭','close')+'"></a>'),
			e
		} () + "</span>" + (r.btn ?
		function() {
			var e = "";
			"string" == typeof r.btn && (r.btn = [r.btn]);
			for (var t = 0,
			i = r.btn.length; t < i; t++) e += '<a class="' + l[6] + t + '">' + r.btn[t] + "</a>";
			return '<div class="' + l[6] + " mlayer-btn-" + (r.btnAlign || "") + '">' + e + "</div>"
		} () : "") + (r.resize ? '<span class="mlayer-resize"></span>': "") + "</div>"], u, i('<div class="mlayer-move"></div>')),
		n
	},
	s.pt.creat = function() {
		var e = this,
		t = e.config,
		a = e.index,
		s = t.content,
		f = "object" == typeof s,
		c = i("body");
		if (!t.id || !i("#" + t.id)[0]) {
			switch ("string" == typeof t.area && (t.area = "auto" === t.area ? ["", ""] : [t.area, ""]), t.shift && (t.anim = t.shift), 6 == r.ie && (t.fixed = !1), t.type) {
			case 0:
				t.btn = "btn" in t ? t.btn: o.btn[0],
				r.closeAll("dialog");
				break;
			case 2:
				var s = t.content = f ? t.content: [t.content, "auto"];
				t.content = '<iframe scrolling="' + (t.content[1] || "auto") + '" allowtransparency="true" id="' + l[4] + a + '" name="' + l[4] + a + '"  frameborder="0" src="' + t.content[0] + '"></iframe>';//t.content = '<iframe scrolling="' + (t.content[1] || "auto") + '" allowtransparency="true" id="' + l[4] + a + '" name="' + l[4] + a + '" onload="this.className=\'\';" class="mlayer-load" frameborder="0" src="' + t.content[0] + '"></iframe>';
				break;
			case 3:
				delete t.title,
				delete t.closeBtn,
				t.icon === -1 && 0 === t.icon,
				r.closeAll("loading");
				break;
			case 4:
				f || (t.content = [t.content, "body"]),
				t.follow = t.content[1],
				t.content = t.content[0] + '<i class="mlayer-TipsG"></i>',
				delete t.title,
				t.tips = "object" == typeof t.tips ? t.tips: [t.tips, !0],
				t.tipsMore || r.closeAll("tips")
			}
			e.vessel(f,
			function(n, r, u) {
				c.append(n[0]),
				f ?
				function() {
					2 == t.type || 4 == t.type ?
					function() {
						i("body").append(n[1])
					} () : function() {
						s.parents("." + l[0])[0] || (s.data("display", s.css("display")).show().addClass("mlayer-wrap").wrap(n[1]), i("#" + l[0] + a).find("." + l[5]).before(r))
					} ()
				} () : c.append(n[1]),
				i(".mlayer-move")[0] || c.append(o.moveElem = u),
				e.moslayer = i("#" + l[0] + a),
				t.scrollbar || l.html.css("overflow", "hidden").attr("layer-full", a)
			}).auto(a),
			2 == t.type && 6 == r.ie && e.moslayer.find("iframe").attr("src", s[0]),
			4 == t.type ? e.tips() : e.offset(),
			t.fixed && n.on("resize",
			function() {
				e.offset(),
				(/^\d+%$/.test(t.area[0]) || /^\d+%$/.test(t.area[1])) && e.auto(a),
				4 == t.type && e.tips()
			}),
			t.time <= 0 || setTimeout(function() {
				r.close(e.index)
			},
			t.time),
			e.move().callback(),
			l.anim[t.anim] && e.moslayer.addClass(l.anim[t.anim]),
			t.isOutAnim && e.moslayer.data("isOutAnim", !0)
		}
	},
	s.pt.auto = function(e) {
		function t(e) {
			e = s.find(e),
			e.height(f[1] - c - u - 2 * (0 | parseFloat(e.css("padding-top"))))
		}
		var a = this,
		o = a.config,
		s = i("#" + l[0] + e);
		"" === o.area[0] && o.maxWidth > 0 && (r.ie && r.ie < 8 && o.btn && s.width(s.innerWidth()), s.outerWidth() > o.maxWidth && s.width(o.maxWidth));
		var f = [s.innerWidth(), s.innerHeight()],
		c = s.find(l[1]).outerHeight() || 0,
		u = s.find("." + l[6]).outerHeight() || 0;
		switch (o.type) {
		case 2:
			t("iframe");
			break;
		default:
			"" === o.area[1] ? o.fixed && f[1] >= n.height() && (f[1] = n.height(), t("." + l[5])) : t("." + l[5])
		}
		return a
	},
	s.pt.offset = function() {
		var e = this,
		t = e.config,
		i = e.moslayer,
		a = [i.outerWidth(), i.outerHeight()],
		o = "object" == typeof t.offset;
		e.offsetTop = (n.height() - a[1]) / 2,
		e.offsetLeft = (n.width() - a[0]) / 2,
		o ? (e.offsetTop = t.offset[0], e.offsetLeft = t.offset[1] || e.offsetLeft) : "auto" !== t.offset && ("t" === t.offset ? e.offsetTop = 0 : "r" === t.offset ? e.offsetLeft = n.width() - a[0] : "b" === t.offset ? e.offsetTop = n.height() - a[1] : "l" === t.offset ? e.offsetLeft = 0 : "lt" === t.offset ? (e.offsetTop = 0, e.offsetLeft = 0) : "lb" === t.offset ? (e.offsetTop = n.height() - a[1], e.offsetLeft = 0) : "rt" === t.offset ? (e.offsetTop = 0, e.offsetLeft = n.width() - a[0]) : "rb" === t.offset ? (e.offsetTop = n.height() - a[1], e.offsetLeft = n.width() - a[0]) : e.offsetTop = t.offset),
		t.fixed || (e.offsetTop = /%$/.test(e.offsetTop) ? n.height() * parseFloat(e.offsetTop) / 100 : parseFloat(e.offsetTop), e.offsetLeft = /%$/.test(e.offsetLeft) ? n.width() * parseFloat(e.offsetLeft) / 100 : parseFloat(e.offsetLeft), e.offsetTop += n.scrollTop(), e.offsetLeft += n.scrollLeft()),
		i.attr("minLeft") && (e.offsetTop = n.height() - (i.find(l[1]).outerHeight() || 0), e.offsetLeft = i.css("left")),
		i.css({
			top: e.offsetTop,
			left: e.offsetLeft
		})
	},
	s.pt.tips = function() {
		var e = this,
		t = e.config,
		a = e.moslayer,
		o = [a.outerWidth(), a.outerHeight()],
		r = i(t.follow);
		r[0] || (r = i("body"));
		var s = {
			width: r.outerWidth(),
			height: r.outerHeight(),
			top: r.offset().top,
			left: r.offset().left
		},
		f = a.find(".mlayer-TipsG"),
		c = t.tips[0];
		t.tips[1] || f.remove(),
		s.autoLeft = function() {
			s.left + o[0] - n.width() > 0 ? (s.tipLeft = s.left + s.width - o[0], f.css({
				right: 12,
				left: "auto"
			})) : s.tipLeft = s.left
		},
		s.where = [function() {
			s.autoLeft(),
			s.tipTop = s.top - o[1] - 10,
			f.removeClass("mlayer-TipsB").addClass("mlayer-TipsT").css("border-right-color", t.tips[1])
		},
		function() {
			s.tipLeft = s.left + s.width + 10,
			s.tipTop = s.top,
			f.removeClass("mlayer-TipsL").addClass("mlayer-TipsR").css("border-bottom-color", t.tips[1])
		},
		function() {
			s.autoLeft(),
			s.tipTop = s.top + s.height + 10,
			f.removeClass("mlayer-TipsT").addClass("mlayer-TipsB").css("border-right-color", t.tips[1])
		},
		function() {
			s.tipLeft = s.left - o[0] - 10,
			s.tipTop = s.top,
			f.removeClass("mlayer-TipsR").addClass("mlayer-TipsL").css("border-bottom-color", t.tips[1])
		}],
		s.where[c - 1](),
		1 === c ? s.top - (n.scrollTop() + o[1] + 16) < 0 && s.where[2]() : 2 === c ? n.width() - (s.left + s.width + o[0] + 16) > 0 || s.where[3]() : 3 === c ? s.top - n.scrollTop() + s.height + o[1] + 16 - n.height() > 0 && s.where[0]() : 4 === c && o[0] + 16 - s.left > 0 && s.where[1](),
		a.find("." + l[5]).css({
			"background-color": t.tips[1],
			"padding-right": t.closeBtn ? "30px": ""
		}),
		a.css({
			left: s.tipLeft - (t.fixed ? n.scrollLeft() : 0),
			top: s.tipTop - (t.fixed ? n.scrollTop() : 0)
		})
	},
	s.pt.move = function() {
		var e = this,
		t = e.config,
		a = i(document),
		s = e.moslayer,
		l = s.find(t.move),
		f = s.find(".mlayer-resize"),
		c = {};
		return t.move && l.css("cursor", "default"),
		l.on("mousedown",
		function(e) {
			e.preventDefault(),
			t.move && (c.moveStart = !0, c.offset = [e.clientX - parseFloat(s.css("left")), e.clientY - parseFloat(s.css("top"))], o.moveElem.css("cursor", "default").show())
		}),
		f.on("mousedown",
		function(e) {
			e.preventDefault(),
			c.resizeStart = !0,
			c.offset = [e.clientX, e.clientY],
			c.area = [s.outerWidth(), s.outerHeight()],
			o.moveElem.css("cursor", "se-resize").show()
		}),
		a.on("mousemove",
		function(i) {
			if (c.moveStart) {
				var a = i.clientX - c.offset[0],
				o = i.clientY - c.offset[1],
				l = "fixed" === s.css("position");
				if (i.preventDefault(), c.stX = l ? 0 : n.scrollLeft(), c.stY = l ? 0 : n.scrollTop(), !t.moveOut) {
					var f = n.width() - s.outerWidth() + c.stX,
					u = n.height() - s.outerHeight() + c.stY;
					a < c.stX && (a = c.stX),
					a > f && (a = f),
					o < c.stY && (o = c.stY),
					o > u && (o = u)
				}
				s.css({
					left: a,
					top: o
				})
			}
			if (t.resize && c.resizeStart) {
				var a = i.clientX - c.offset[0],
				o = i.clientY - c.offset[1];
				i.preventDefault(),
				r.style(e.index, {
					width: c.area[0] + a,
					height: c.area[1] + o
				}),
				c.isResize = !0,
				t.resizing && t.resizing(s)
			}
		}).on("mouseup",
		function(e) {
			c.moveStart && (delete c.moveStart, o.moveElem.hide(), t.moveEnd && t.moveEnd(s)),
			c.resizeStart && (delete c.resizeStart, o.moveElem.hide())
		}),
		e
	},
	s.pt.callback = function() {
		function e() {
			var e = a.cancel && a.cancel(t.index, n);
			e === !1 || r.close(t.index)
		}
		var t = this,
		n = t.moslayer,
		a = t.config;
		t.openLayer(),
		a.success && (2 == a.type ? n.find("iframe").on("load",
		function() {
			a.success(n, t.index)
		}) : a.success(n, t.index)),
		6 == r.ie && t.IE6(n),
		n.find("." + l[6]).children("a").on("click",
		function() {
			var e = i(this).index();
			if (0 === e) a.yes ? a.yes(t.index, n) : a.btn1 ? a.btn1(t.index, n) : r.close(t.index);
			else {
				var o = a["btn" + (e + 1)] && a["btn" + (e + 1)](t.index, n);
				o === !1 || r.close(t.index)
			}
		}),
		n.find("." + l[7]).on("click", e),
		a.shadeClose && i("#mlayer-shade" + t.index).on("click",
		function() {
			r.close(t.index)
		}),
		n.find(".mlayer-min").on("click",
		function() {
			var e = a.min && a.min(n);
			e === !1 || r.min(t.index, a)
		}),
		n.find(".mlayer-max").on("click",
		function() {
			i(this).hasClass("mlayer-maxmin") ? (r.restore(t.index), a.restore && a.restore(n)) : (r.full(t.index, a), setTimeout(function() {
				a.full && a.full(n)
			},
			100))
		}),
		a.end && (o.end[t.index] = a.end)
	},
	o.reselect = function() {
		i.each(i("select"),
		function(e, t) {
			var n = i(this);
			n.parents("." + l[0])[0] || 1 == n.attr("layer") && i("." + l[0]).length < 1 && n.removeAttr("layer").show(),
			n = null
		})
	},
	s.pt.IE6 = function(e) {
		i("select").each(function(e, t) {
			var n = i(this);
			n.parents("." + l[0])[0] || "none" === n.css("display") || n.attr({
				layer: "1"
			}).hide(),
			n = null
		})
	},
	s.pt.openLayer = function() {
		var e = this;
		r.zIndex = e.config.zIndex,
		r.setTop = function(e) {
			var t = function() {
				r.zIndex++,
				e.css("z-index", r.zIndex + 1)
			};
			return r.zIndex = parseInt(e[0].style.zIndex),
			e.on("mousedown", t),
			r.zIndex
		}
	},
	o.record = function(e) {
		var t = [e.width(), e.height(), e.position().top, e.position().left + parseFloat(e.css("margin-left"))];
		e.find(".mlayer-max").addClass("mlayer-maxmin"),
		e.attr({
			area: t
		})
	},
	o.rescollbar = function(e) {
		l.html.attr("layer-full") == e && (l.html[0].style.removeProperty ? l.html[0].style.removeProperty("overflow") : l.html[0].style.removeAttribute("overflow"), l.html.removeAttr("layer-full"))
	},
	e.layer = r,
	r.getChildFrame = function(e, t) {
		return t = t || i("." + l[4]).attr("times"),
		i("#" + l[0] + t).find("iframe").contents().find(e)
	},
	r.getFrameIndex = function(e) {
		return i("#" + e).parents("." + l[4]).attr("times")
	},
	r.iframeAuto = function(e) {
		if (e) {
			var t = r.getChildFrame("html", e).outerHeight(),
			n = i("#" + l[0] + e),
			a = n.find(l[1]).outerHeight() || 0,
			o = n.find("." + l[6]).outerHeight() || 0;
			n.css({
				height: t + a + o
			}),
			n.find("iframe").css({
				height: t
			})
		}
	},
	r.iframeSrc = function(e, t) {
		i("#" + l[0] + e).find("iframe").attr("src", t)
	},
	r.style = function(e, t, n) {
		var a = i("#" + l[0] + e),
		r = a.find(".mlayer-content"),
		s = a.attr("type"),
		f = a.find(l[1]).outerHeight() || 0,
		c = a.find("." + l[6]).outerHeight() || 0;
        a.attr("minLeft");
		s !== o.type[3] && s !== o.type[4] && (n || (parseFloat(t.width) <= 260 && (t.width = 260), parseFloat(t.height) - f - c <= 64 && (t.height = 64 + f + c)), a.css(t), c = a.find("." + l[6]).outerHeight() || 0, s === o.type[2] ? a.find("iframe").css({
			height: parseFloat(t.height) - f - c
		}) : r.css({
			height: parseFloat(t.height) - f - c - parseFloat(r.css("padding-top")) - parseFloat(r.css("padding-bottom"))
        }));
	},
	r.min = function(e, t) {//窗口最小化
		var a = i("#" + l[0] + e),
		s = a.find(l[1]).outerHeight() || 0,
		f = a.attr("minLeft") || 181 * o.minIndex + "px",
		c = a.css("position");
		o.record(a),
		o.minLeft[0] && (f = o.minLeft[0], o.minLeft.shift()),
		a.attr("position", c),
		r.style(e, {
			width: 180,
			height: s,
			left: f,
			top: n.height() - s,
			position: "fixed",
			overflow: "hidden"
		},
		!0),
		a.find(".mlayer-min").hide(),
		"page" === a.attr("type") && a.find(l[4]).hide(),
		o.rescollbar(e),
		a.attr("minLeft") || o.minIndex++,
		a.attr("minLeft", f)
	},
	r.restore = function(e) {//窗口还原
		var t = i("#" + l[0] + e),
        n = t.attr("area").split(",");
		t.attr("type");
		r.style(e, {
			width: parseFloat(n[0]),
			height: parseFloat(n[1]),
			top: parseFloat(n[2]),
			left: parseFloat(n[3]),
			position: t.attr("position"),
			overflow: "visible"
		},
		!0),
		t.find(".mlayer-max").removeClass("mlayer-maxmin"),
		t.find(".mlayer-min").show(),
		"page" === t.attr("type") && t.find(l[4]).show(),
		o.rescollbar(e)
	},
	r.full = function(e) {//窗口最大化
		var t, a = i("#" + l[0] + e);
		o.record(a),
		l.html.attr("layer-full") || l.html.css("overflow", "hidden").attr("layer-full", e),
		clearTimeout(t),
		t = setTimeout(function() {
			var t = "fixed" === a.css("position");
			r.style(e, {
				top: t ? 0 : n.scrollTop(),
				left: t ? 0 : n.scrollLeft(),
				width: n.width(),
				height: n.height()-40//此处40为任务栏高度
			},
			!0),
			a.find(".mlayer-min").hide()
		},
		100)
	},
	r.title = function(e, t) {
		var n = i("#" + l[0] + (t || r.index)).find(l[1]);
		n.html(e)
	},
	r.close = function(e) {
		var t = i("#" + l[0] + e),
		n = t.attr("type"),
		a = "layer-anim-close";
		if (t[0]) {
			var s = "mlayer-wrap",
			f = function() {
				if (n === o.type[1] && "object" === t.attr("conType")) {
					t.children(":not(." + l[5] + ")").remove();
					for (var a = t.find("." + s), r = 0; r < 2; r++) a.unwrap();
					a.css("display", a.data("display")).removeClass(s)
				} else {
					if (n === o.type[2]) try {
						var f = i("#" + l[4] + e)[0];
						f.contentWindow.document.write(""),
						f.contentWindow.close(),
						t.find("." + l[5])[0].removeChild(f)
					} catch(c) {}
					t[0].innerHTML = "",
					t.remove()
				}
				"function" == typeof o.end[e] && o.end[e](),
				delete o.end[e]
			};
			t.data("isOutAnim") && t.addClass(a),
			i("#mlayer-moves, #mlayer-shade" + e).remove(),
			6 == r.ie && o.reselect(),
			o.rescollbar(e),
			t.attr("minLeft") && (o.minIndex--, o.minLeft.push(t.attr("minLeft"))),
			r.ie && r.ie < 10 || !t.data("isOutAnim") ? f() : setTimeout(function() {
				f()
			},
			200)
		}
	},
	r.closeAll = function(e) {
		i.each(i("." + l[0]),
		function() {
			var t = i(this),
			n = e ? t.attr("type") === e: 1;
			n && r.close(t.attr("times")),
			n = null
		})
	};
	var f = r.cache || {},
	c = function(e) {
		return f.skin ? " " + f.skin + " " + f.skin + "-" + e: ""
	};
	r.prompt = function(e, t) {
		var a = "";
		if (e = e || {},
		"function" == typeof e && (t = e), e.area) {
			var o = e.area;
			a = 'style="width: ' + o[0] + "; height: " + o[1] + ';"',
			delete e.area
		}
		var s, l = 2 == e.formType ? '<textarea class="mlayer-input"' + a + ">" + (e.value || "") + "</textarea>": function() {
			return '<input type="' + (1 == e.formType ? "password": "text") + '" class="mlayer-input" value="' + (e.value || "") + '">'
		} (),
		f = e.success;
		return delete e.success,
		r.open(i.extend({
			type: 1,
			btn: ["&#x786E;&#x5B9A;", "&#x53D6;&#x6D88;"],
			content: l,
			skin: "mlayer-prompt" + c("prompt"),
			maxWidth: n.width(),
			success: function(e) {
				s = e.find(".mlayer-input"),
				s.focus(),
				"function" == typeof f && f(e)
			},
			resize: !1,
			yes: function(i) {
				var n = s.val();
				"" === n ? s.focus() : n.length > (e.maxlength || 500) ? r.tips("&#x6700;&#x591A;&#x8F93;&#x5165;" + (e.maxlength || 500) + "&#x4E2A;&#x5B57;&#x6570;", s, {
					tips: 1
				}) : t && t(n, i, s)
			}
		},
		e))
	},
	r.tab = function(e) {
		e = e || {};
		var t = e.tab || {},
		n = e.success;
		return delete e.success,
		r.open(i.extend({
			type: 1,
			skin: "mlayer-tab" + c("tab"),
			resize: !1,
			title: function() {
				var e = t.length,
				i = 1,
				n = "";
				if (e > 0) for (n = '<span class="mlayer-tabnow">' + t[0].title + "</span>"; i < e; i++) n += "<span>" + t[i].title + "</span>";
				return n
			} (),
			content: '<ul class="mlayer-tabmain">' +
			function() {
				var e = t.length,
				i = 1,
				n = "";
				if (e > 0) for (n = '<li class="mlayer-tabli xubox_tab_layer">' + (t[0].content || "no content") + "</li>"; i < e; i++) n += '<li class="mlayer-tabli">' + (t[i].content || "no  content") + "</li>";
				return n
			} () + "</ul>",
			success: function(t) {
				var a = t.find(".mlayer-title").children(),
				o = t.find(".mlayer-tabmain").children();
				a.on("mousedown",
				function(t) {
					t.stopPropagation ? t.stopPropagation() : t.cancelBubble = !0;
					var n = i(this),
					a = n.index();
					n.addClass("mlayer-tabnow").siblings().removeClass("mlayer-tabnow"),
					o.eq(a).show().siblings().hide(),
					"function" == typeof e.change && e.change(a)
				}),
				"function" == typeof n && n(t)
			}
		},
		e))
	},
	r.photos = function(t, n, a) {
		function o(e, t, i) {
			var n = new Image;
			return n.src = e,
			n.complete ? t(n) : (n.onload = function() {
				n.onload = null,
				t(n)
			},
			void(n.onerror = function(e) {
				n.onerror = null,
				i(e)
			}))
		}
		var s = {};
		if (t = t || {},
		t.photos) {
			var l = t.photos.constructor === Object,
			f = l ? t.photos: {},
			u = f.data || [],
			d = f.start || 0;
			s.imgIndex = (0 | d) + 1,
			t.img = t.img || "img";
			var y = t.success;
			if (delete t.success, l) {
				if (0 === u.length) return r.msg("&#x6CA1;&#x6709;&#x56FE;&#x7247;")
			} else {
				var p = i(t.photos),
				h = function() {
					u = [],
					p.find(t.img).each(function(e) {
						var t = i(this);
						t.attr("layer-index", e),
						u.push({
							alt: t.attr("alt"),
							pid: t.attr("layer-pid"),
							src: t.attr("layer-src") || t.attr("src"),
							thumb: t.attr("src")
						})
					})
				};
				if (h(), 0 === u.length) return;
				if (n || p.on("click", t.img,
				function() {
					var e = i(this),
					n = e.attr("layer-index");
					r.photos(i.extend(t, {
						photos: {
							start: n,
							data: u,
							tab: t.tab
						},
						full: t.full
					}), !0),
					h()
				}), !n) return
			}
			s.imgprev = function(e) {
				s.imgIndex--,
				s.imgIndex < 1 && (s.imgIndex = u.length),
				s.tabimg(e)
			},
			s.imgnext = function(e, t) {
				s.imgIndex++,
				s.imgIndex > u.length && (s.imgIndex = 1, t) || s.tabimg(e)
			},
			s.keyup = function(e) {
				if (!s.end) {
					var t = e.keyCode;
					e.preventDefault(),
					37 === t ? s.imgprev(!0) : 39 === t ? s.imgnext(!0) : 27 === t && r.close(s.index)
				}
			},
			s.tabimg = function(e) {
				if (! (u.length <= 1)) return f.start = s.imgIndex - 1,
				r.close(s.index),
				r.photos(t, !0, e)
			},
			s.event = function() {
				s.bigimg.hover(function() {
					s.imgsee.show()
				},
				function() {
					s.imgsee.hide()
				}),
				s.bigimg.find(".mlayer-imgprev").on("click",
				function(e) {
					e.preventDefault(),
					s.imgprev()
				}),
				s.bigimg.find(".mlayer-imgnext").on("click",
				function(e) {
					e.preventDefault(),
					s.imgnext()
				}),
				i(document).on("keyup", s.keyup)
			},
			s.loadi = r.load(1, {
				shade: !("shade" in t) && .9,
				scrollbar: !1
			}),
			o(u[d].src,
			function(n) {
				r.close(s.loadi),
				s.index = r.open(i.extend({
					type: 1,
					id: "mlayer-photos",
					area: function() {
						var a = [n.width, n.height],
						o = [i(e).width() - 100, i(e).height() - 100];
						if (!t.full && (a[0] > o[0] || a[1] > o[1])) {
							var r = [a[0] / o[0], a[1] / o[1]];
							r[0] > r[1] ? (a[0] = a[0] / r[0], a[1] = a[1] / r[0]) : r[0] < r[1] && (a[0] = a[0] / r[1], a[1] = a[1] / r[1])
						}
						return [a[0] + "px", a[1] + "px"]
					} (),
					title: !1,
					shade: .9,
					shadeClose: !0,
					closeBtn: !1,
					move: ".mlayer-phimg img",
					moveType: 1,
					scrollbar: !1,
					moveOut: !0,
					isOutAnim: !1,
					skin: "mlayer-photos" + c("photos"),
					content: '<div class="mlayer-phimg"><img src="' + u[d].src + '" alt="' + (u[d].alt || "") + '" layer-pid="' + u[d].pid + '"><div class="mlayer-imgsee">' + (u.length > 1 ? '<span class="mlayer-imguide"><a href="javascript:;" class="mlayer-iconext mlayer-imgprev"></a><a href="javascript:;" class="mlayer-iconext mlayer-imgnext"></a></span>': "") + '<div class="mlayer-imgbar" style="display:' + (a ? "block": "") + '"><span class="mlayer-imgtit"><a href="javascript:;">' + (u[d].alt || "") + "</a><em>" + s.imgIndex + "/" + u.length + "</em></span></div></div></div>",
					success: function(e, i) {
						s.bigimg = e.find(".mlayer-phimg"),
						s.imgsee = e.find(".mlayer-imguide,.mlayer-imgbar"),
						s.event(e),
						t.tab && t.tab(u[d], e),
						"function" == typeof y && y(e)
					},
					end: function() {
						s.end = !0,
						i(document).off("keyup", s.keyup)
					}
				},
				t))
			},
			function() {
				r.close(s.loadi),
				r.msg("&#x5F53;&#x524D;&#x56FE;&#x7247;&#x5730;&#x5740;&#x5F02;&#x5E38;<br>&#x662F;&#x5426;&#x7EE7;&#x7EED;&#x67E5;&#x770B;&#x4E0B;&#x4E00;&#x5F20;&#xFF1F;", {
					time: 3e4,
					btn: ["&#x4E0B;&#x4E00;&#x5F20;", "&#x4E0D;&#x770B;&#x4E86;"],
					yes: function() {
						u.length > 1 && s.imgnext(!0, !0)
					}
				})
			})
		}
	},
	o.run = function(t) {
		i = t,
		n = i(e),
		l.html = i("html"),
		r.open = function(e) {
			var t = new s(e);
			return t.index
		}
	},
	e.layui && layui.define ? (r.ready(), layui.define("jquery",
	function(t) {
		r.path = layui.cache.dir,
		o.run(layui.jquery),
		e.layer = r,
		t("layer", r)
	})) : "function" == typeof define && define.amd ? define(["jquery"],
	function() {
		return o.run(e.jQuery),
		r
	}) : function() {
		o.run(e.jQuery),
		r.ready()
	} ()
} (window);