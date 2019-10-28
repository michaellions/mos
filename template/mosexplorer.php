<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="../core/js/jquery-3.3.1.js"></script>
    <link href="../core/css/default.css" rel="stylesheet">
</head>
<body>
    <div class="base">
        <div class="left">
            ffafsfa
        </div>
        <div class="right">
            gdggsgdgs
        </div>
    </div>  
</body>
<script>
    document.oncontextmenu=new Function("event.returnValue=false;");//屏蔽右键
    document.onselectstart=new Function("event.returnValue=false;");//屏蔽选择内容
    mosparent=parent.mos; //获取父级mos对象的句柄
    var username=mosparent.getcookie("mos_user_id");
    var userDataSet=mosparent.getuserinfo(username);//当前用户数据库
    var desktopDataSet=mosparent.getdesktopdata(username);//当前用户桌面信息数据库
    var ifrmindex = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    var ifrmid="mlayer-iframe"+ifrmindex;//当前iframe的ID值

    
</script>
</html>
