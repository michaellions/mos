<?php
    if(isset($_COOKIE['mos_user_id']) && $_COOKIE['mos_user_id']!=='null'){//已登陆过
?>
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
        <title></title>
        <link rel='Shortcut Icon' type='image/x-icon' href='./core/img/windows.ico'>
        <script type="text/javascript" src="./core/js/jquery-3.3.1.js"></script>
        <script type="text/javascript" src="./core/js/ztree.js"></script>       
        <link href="./core/css/default.css" rel="stylesheet">
        <link href="./core/css/iconfont.css" rel="stylesheet">
        <link href="./core/css/zTreeStyle.css" rel="stylesheet">
        <link href="./core/css/classic.css" type="text/css" rel="stylesheet" id="skin">
        <script type="text/javascript" src="./core/js/mos.js"></script>
    </head>
    <body>
        <div id="mos">
            <div id="desktop" class="desktop"><!--桌面-->
                <div id="mos-shortcuts">
                </div>
                <div id="mos-desktop-scene">
                </div>
            </div>
            <div id="mos-menu" class="hidden"><!--开始菜单-->
                <div class="sideleft"><!--开始菜单-左边快捷条-->
                </div>
                <div class="list mos-menu-hidden animated animated-slideOutLeft"><!--开始菜单-左边条-->
                </div>
                <div class="blocks"><!--开始菜单-右磁贴-->
                </div>
                <div id="mos-menu-switcher"></div>
            </div>
            <div id="mos_command_center" class="hidden_right">
                <div class="title">
                    <h4 style="float:left">操作中心 </h4>
                    <span id="mos_btn_command_center_clean_all">全部清除</span>
                </div>
                <div class="msgs"></div>
            </div>
            <div id="mos_task_bar" class="mostaskbar"><!--任务栏-->
                <div id="mos_btn_group_left" class="btn_group"></div><!--任务栏左边按钮-->
                <div id="mos_btn_group_middle" class="btn_group"></div><!--任务栏中间按钮-->
                <div id="mos_btn_group_right" class="btn_group"></div><!--任务栏右边系统托盘-->
            </div>            
        </div>
    </body>
</html>
<?php
  }else{
    header('Location:../index.php'); 
  }
?>
