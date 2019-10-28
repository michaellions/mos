<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="../core/js/jquery-3.3.1.js"></script>
    <script type="text/javascript" src="../core/js/md5.js"></script>
    <link href="../core/css/default.css" rel="stylesheet">
    <style>
        #mos-login-box {
            position:absolute;
            top:35%;
            left:45%;
            overflow: hidden;
            margin: 0 auto;
        }
        .mos-login-box-square {
            width: 105px;
            margin: 20px auto;
            position: relative;
            overflow: hidden;
        }
        .mos-login-box-square::after {
            content: "";
            display: block;
            padding-bottom: 100%;
        }
        .mos-login-box-square .content {
            position: absolute;
            width: 100%;
            height: 100%;
        }
        .login-password {
            font-size: 13px;
            border: 1px solid rgb(160, 215, 247);
            color: #000;
            background: rgba(0, 0, 0, 0);
            line-height: 20px;
        }
        #datetime{
            position: absolute;
            color:white;
            left:30px;
            bottom:100px;
            text-shadow: 1px 1px 4px #000;
            cursor: default;
        }
    </style>
</head>
<body>
    <div id="lockscreen" class="locksrc"></div>
    <div id="datetime"></div>
    <div id="mos-login-box" >
        <div class="mos-login-box-square">
            <img id="avatar" src="../core/img/avatar/default.png" class="content"/>
        </div>
        <!--密码-->
        <input type="password" placeholder="请输入密码" required class="login-password"> 
    </div>
</body>
<script>
    document.oncontextmenu=new Function("event.returnValue=false;");//屏蔽右键
    document.onselectstart=new Function("event.returnValue=false;");//屏蔽选择内容
    mosparent=parent.mos; //获取父级mos对象的句柄
    var username=mosparent.getcookie("mos_user_id");
    var userDataSet=mosparent.getuserinfo(username);//当前用户数据库
    var lockslideTimer=null;
    var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
    var lockdateTimer=setInterval(function () {//设置时间格式-定时执行(可以传入参数)
            var myDate = new Date();
            var year=myDate.getFullYear();
            var month=myDate.getMonth()+1;
            var day=myDate.getDay();
            var date=myDate.getDate();
            var hours=myDate.getHours();
            var mins=myDate.getMinutes();
            var seconds=myDate.getSeconds();
            if (mins<10){mins='0'+mins}
            if (seconds<10){seconds='0'+seconds}
            $("#datetime").empty().append('<span style="font-size:100px;line-height:100px;">'+hours+':'+mins+/*':'+seconds+*/'</span><br/><span style="font-size:40px;line-height:40px;">'+month+'月'+date+'日，'+weekday[day]+'</span>');
        },1000);

    $("#mos-login-box").hide();
    switch(mosparent._usersetupDataSet["personal"]["items"][2]["item"]["lockmodel"]){
        case "pic":
            $(".locksrc").css("background-image","url("+mosparent._RootPath+mosparent._usersetupDataSet["personal"]["items"][2]["item"]["lockpic"]+")");
        break;
        case "slide":
            $.post(mosparent._RootPath+"core/func/interactive.php",{"bgfilepath":"../../"+mosparent._usersetupDataSet["personal"]["items"][2]["item"]["slideurl"]},function(data){
                var filenamelist=$.parseJSON(data);
                var randomBgIndex = Math.round( Math.random()*Number(filenamelist.length-1));
                $(".locksrc").css("background-image","url("+mosparent._RootPath+mosparent._usersetupDataSet["personal"]["items"][2]["item"]["slideurl"]+"/"+filenamelist[randomBgIndex]+")");
                lockslideTimer=setInterval(function(){//定时执行
                    var srandomBgIndex = Math.round( Math.random()*Number(filenamelist.length-1));
                    $(".locksrc").css("background-image","url("+mosparent._RootPath+mosparent._usersetupDataSet["personal"]["items"][2]["item"]["slideurl"]+"/"+filenamelist[srandomBgIndex]+")");
                },Number(mosparent._usersetupDataSet["personal"]["items"][2]["item"]["autotime"]));
            });
        break;
        default:
            
    }
    function unlock(){
        //清除超时
        parent.layer.close(Number(mosparent._lockscreenindex));
        window.clearInterval(lockslideTimer);
        window.clearInterval(mosparent._lockscreenTimer);
        mosparent._lockscreenindex="";
    }
    var lockscreensignal = function() {//超时检测
        if(mosparent._usersetupDataSet["personal"]["items"][2]["item"]["unlock"]=="true"){
            $("#mos-login-box").show();
            $("#avatar").attr({"src":"."+userDataSet["avatar"]});
            $("input[type=password]").focus();
            $(document).keydown(function(event){ 
                if(event.keyCode==13){ 
                    if(md5($(".login-password").val())==userDataSet["loginpassword"]){
                    unlock();
                } 
                } 
            });
        }else{
            unlock();
        }
    };
    //document.body.onmousemove = lockscreensignal; 
    document.body.onmousedown = lockscreensignal;
    document.body.onkeydown = lockscreensignal;
    document.body.onkeypress = lockscreensignal;
    
</script>
</html>
