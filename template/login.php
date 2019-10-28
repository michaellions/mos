<?php
    session_start();
    if(isset($_COOKIE['mos_user_id']) && $_COOKIE['mos_user_id']!=='null'){//已登陆过
        include('./template/index.php'); 
    }else{
        $arr = array(0,1,2,3,4,5,6,7,8);
		$get = $arr[mt_rand(0,count($arr)-1)];
		$image = "./core/img/wallpapers/".$get.".jpg";
?>
<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
    <title>MOS 系统登陆</title>
    <script type="text/javascript" src="./core/js/jquery-3.3.1.js"></script>
    <script type="text/javascript" src="./core/js/md5.js"></script>
    <style>
        #mos-login {
            background: url(<?php echo $image;?>) no-repeat fixed;
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
            position: fixed;
            z-index: -1;
            top: 0;
            left: 0;
        }
        #mos-login-box {
            width: 300px;
            overflow: hidden;
            margin: 0 auto;
            box-shadow: 0px 20px 60px rgba(0,0,0,0.4), 0px 0px 150px rgba(0,0,0,0.4);
        }
        .mos-login-box-square {
            width: 105px;
            margin: 20px auto;
            background-color: darkgray;
            position: relative;
            overflow: hidden;
        }
        .mos-login-msg {
            width: 235px;
            background: rgba(255,255,255,0);
            position: relative;
            overflow: hidden;
            font-size: 14px;
            margin: 0px 10px 10px 20px;
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
        input {
            width: 210px;
            display: block;
            border: 1px solid #bbb;
            margin: 0 20px;
            line-height: 35px;
            font-size: 20px;
            padding: 0 10px;
            margin-bottom: 5px;
        }
        .login-form {
            height:210px;
            background: rgba(255,255,255,0.8);
            padding: 5px 20px;
        }
        .login-username, .login-password, .login-checkcode {
            width: 200px;
            font-size: 13px;
            color: #000;
        }
        .login-checkcode {
            width: 120px;
            margin: 0px 10px 10px 20px;
            float: left; 
        }
        .login-checkbox {
            width: 22px;
            height: 22px;
            margin: 5px 10px 10px 20px;
            float: left; 
            position: absolute;
        }
        .login-rm {
            float: left;
            margin: 48px 0 0 -198px;
            line-height: 14px;
            font-size: 14px;
            position: absolute;
        }
        .login-submit {
            margin: 25px 10px 0px 20px;
            float: left;
            background-color: #009688;
            width: 223px;
            display: inline-block;
            height: 35px;
            line-height: 35px;
            padding: 0 auto;
            color: #CCFFCC;
            white-space: nowrap;
            text-align: center;
            font-size: 16px;
            border: none;
            cursor: pointer;
            opacity: .8;
            filter: alpha(opacity=80);
        }
    </style>
</head>
<body>
<div id="mos-login">
    <div style="height: 10%;min-height: 120px"></div>
    <div id="mos-login-box">
        <div class="mos-login-box-square">
            <img id="avatar" src="./core/img/avatar/default.png" class="content"/>
        </div>
        <div class="login-form">
            <!--用户名-->
            <input type="text" placeholder="请输入登录名" required class="login-username" autocomplete="on">
            <!--密码-->
            <input type="password" placeholder="请输入密码" required class="login-password">
            <!--验证码-->
	   		<input type="text" placeholder="输入验证码" class="login-checkcode" required autocomplete="off"/>
	 	  	<img title="点击刷新" src='./core/func/checkcode.php' onclick="this.src='./core/func/checkcode.php'" />
            <input type="checkbox" class="login-checkbox" checked id='rm'/>
	  	    <label for="rm" class="login-rm">记住密码</label>
            <!--登陆按钮-->
            <input type="submit"  value="登录" id="btn-login" class="login-submit"/>
            <div class="mos-login-msg" id="msg"></div>
        </div>   
    </div>
</div>
</body>
<script type="text/javascript" >
    var userdb=[];
    $.ajaxSettings.async = false;
    $.getJSON("data/system/user.json",function(data){
        userdb=data["data"];
    });
    $.ajaxSettings.async = true;
    var username="";
    $(".login-username").blur(function(){
        username=$(".login-username").val();
        for (var i=0;i<userdb.length;i++){
            if (userdb[i]["loginname"]==username){
                $("#avatar").attr({"src":userdb[i]["avatar"]});
                break;
            }
        }
    });
    $("#btn-login").click(function(){
        var userpassword=md5($(".login-password").val());
        var usercheckcode=$(".login-checkcode").val();
        var rm=document.getElementById("rm").checked;
        var usererror=true;
        document.getElementById("msg").style.color="blue";
        document.getElementById("msg").innerText="正在校验登入信息,请稍等...";
        for (var i=0;i<userdb.length;i++){
            if (userdb[i]["loginname"]==username){
                $.post("core/func/checkup.php",{"lname":username,"lpsw":userpassword,"rem":rm,"vcode":usercheckcode,"dbpsw":userdb[i]["loginpassword"]},function(msg){ 
                    if(msg==1){
                        document.getElementById("msg").style.color="green";
                        document.getElementById("msg").innerText="登入成功！正在进入桌面...";
                        window.location.reload();
                    }else{
                        document.getElementById("msg").style.color="red";
                        document.getElementById("msg").innerText=msg;
                    }
                });
                usererror=false;
                break;
            }
        }
        if(usererror){
            document.getElementById("msg").style.color="red";
            document.getElementById("msg").innerText="请输入正确的用户名、密码及验证码!";
        }
    });
</script>
</html>
<?php
    }
?>