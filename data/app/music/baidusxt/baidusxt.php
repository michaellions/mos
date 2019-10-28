<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="../../../../core/js/jquery-3.3.1.js"></script>
    <link href="../../../../core/css/default.css" rel="stylesheet">
</head>
<body>
    <iframe src="http://fm.baidu.com/" id="baidufmFrame" width=100% height=100% frameborder="no" border="0"></iframe>
</body>
<script>
    document.oncontextmenu=new Function("event.returnValue=false;");//屏蔽右键
    document.onselectstart=new Function("event.returnValue=false;");//屏蔽选择内容
    mosparent=parent.mos; //获取父级mos对象的句柄
    var username=mosparent.getcookie("mos_user_id");
    var userDataSet=mosparent.getuserinfo(username);//当前用户数据库
    var desktopDataSet=mosparent.getdesktopdata(username);//当前用户桌面信息数据库
    var ifrmindex = parent.layer.index; //先得到当前iframe层的索引
    var ifrmid="mlayer-iframe"+ifrmindex;//当前iframe的ID值

    
</script>
</html>
