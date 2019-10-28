<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="../core/js/jquery-3.3.1.js"></script>
    <script type="text/javascript" src="../core/js/ztree.js"></script>
    <link href="../core/css/default.css" rel="stylesheet">
    <link href="../core/css/iconfont.css" rel="stylesheet">
    <link href="../core/css/zTreeStyle.css" rel="stylesheet">
</head>
<body>
    <div class="base">
        <div class="ribbon">
            <div class="rbtop">
                <div class="rbfile">文件</div>
                <div class="rbbutton rbhome active">主页</div>
                <div class="rbbutton rbshare">共享</div>
                <div class="rbbutton rbview">查看</div>
                <div class="rbhelp" title="帮助&#10;获取帮助"><i class="iconfont icon-help" style="font-size:12px;color:rgba(1, 126, 255, 1);text-align:center;display:block;"></i></div>
                <div class="rbupdown" title="展开功能区&#10;显示功能区"><i class="iconfont icon-down" style="font-size:12px;text-align:center;display:block;"></i></div>
            </div>
            <div class="rbcontent">
                <div class="content rbhome" style="display:block;background-color:rgb(247, 247, 247);width:100%;height:100%;">    
                </div>
                <div class="content rbshare" style="display:none;background-color:rgb(247, 247, 247);width:100%;height:100%;">
                </div>
                <div class="content rbview" style="display:none;background-color:rgb(247, 247, 247);width:100%;height:100%;">
                </div>
            </div>
        </div>
        <div class="fmtop">
            <div class="fmicon fmprev" title="后退"><i class="iconfont icon-arrowleft"></i></div>
            <div class="fmicon fmnext" title="前进"><i class="iconfont icon-arrowright"></i></div>
            <div class="fmicon fmdown" style="width:14px;" title="最近浏览的位置"><i class="iconfont icon-down" style="font-size:12px;text-align:center;display:block;"></i></div>
            <div class="fmdownlist"></div>
            <div class="fmicon fmup" title="上移一级"><i class="iconfont icon-arrowup"></i></div>
            <div class="fmpathfrm"></div>
            <div class="fmpdownlist"></div>  
            <div class="fmpath"><input class="fmpathtext" type="text"/><div class="fmicon fmrefresh" title="刷新"><i class="iconfont icon-shuaxin1" style="font-size:10px;text-align:center;-webkit-transform:scale(0.8);display:block;"></i></div></div>
            <div class="fmtopright"><input class="fmsearch" type="text" placeholder="搜索"/></div>
        </div>
        <div class="fmleft"><ul id="fmltree" class="ztree mltree"></ul></div>
        <div class="fmmiddle"></div>
        <div class="fmright"><ul id="fmrtree" class="ztree mrtree"></ul></div>
        <div class="fmbottom"><span class="totalitem"></span>个项目   选中<span class="selecteditem"></span>0个项目<img class="xm"/></div>
    </div>  
</body>
<script>
    document.oncontextmenu=new Function("event.returnValue=false;");//屏蔽右键
    document.onselectstart=new Function("event.returnValue=false;");//屏蔽选择内容 
    var mosparent=parent.mos; //获取父级mos对象的句柄 
    var rbhome=''+
    '<div class="rbb rbclipboard">'+
        '<div class="rbbcontent">'+
            '<div class="rbbcbutton rbbpin" title="固定到&quot;快速访问&quot;&#10;将文件夹固定到&quot;快速访问&quot;"><img src="'+mosparent._RootPath+'core/img/icon/pin.png" style="width:24px;height:24px;margin:5px 15px 8px 15px;" />'+
                '固定到"快速访问"'+
            '</div>'+
            '<div class="rbbcbutton rbbcopy" title="复制&#10;将所选项目复制到剪贴板"><img src="'+mosparent._RootPath+'core/img/icon/copy.png" style="width:32px;height:32px;margin:5px 2px 0 2px;" />'+
                '复制'+
            '</div>'+
            '<div class="rbbcbutton rbbpaste" title="粘贴&#10;将剪贴板的内容粘贴到当前位置"><img src="'+mosparent._RootPath+'core/img/icon/paste.png" style="width:32px;height:32px;margin:5px 2px 0 2px;" />'+
                '粘贴'+
           '</div>'+
            '<div class="rbbcbutton rbbcopypath" style="width:75px;height:22px;margin:4px 0 0 10px;" title="复制路径&#10;将所选项目的路径复制到剪贴板"><img src="'+mosparent._RootPath+'core/img/icon/copypath.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                ' 复制路径'+
            '</div>'+
            '<div class="rbbcbutton rbbpastekj" style="width:95px;height:22px;margin:0 0 0 10px;" title="功能键(未开发)&#10;敬请期待"><img src="'+mosparent._RootPath+'core/img/icon/default.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                ' 功能键'+
            '</div>'+
            '<div style="width:150px;height:22px;margin:2px 0 0 0;float:left;">'+
                '<div class="rbbcbutton rbbcut" title="剪切&#10;将所选项目移动到剪贴板"><img src="'+mosparent._RootPath+'core/img/icon/cut.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                    ' 剪切'+
                '</div>'+
            '</div>'+
        '</div>'+
        '<div class="rbbbottom">剪贴板</div>'+
    '</div>'+
    '<div class="rbb rborganize">'+
        '<div class="rbbcontent">'+
            '<div class="rbbcbutton rbbmoveto" title="移动到&#10;将所选项目移动到所选位置"><img src="'+mosparent._RootPath+'core/img/icon/moveto.png" style="width:32px;height:32px;margin:5px 2px 0 2px;" />'+
                '移动到<i class="fa fa-sort-down" style="position: absolute;top: 85px;left: 285px;"></i>'+
            '</div>'+
            '<div class="rbbcbutton rbbcopyto" title="复制到&#10;将所选项目复制到所选位置"><img src="'+mosparent._RootPath+'core/img/icon/copyto.png" style="width:32px;height:32px;margin:5px 0 0 0;" />'+
                '复制到<i class="fa fa-sort-down" style="position: absolute;top: 85px;left: 325px;"></i>'+
           '</div>'+
           '<hr style="height:50px;float:left;margin:15px 2px 0 2px;">'+
           '<div class="rbbcbutton rbbcopyto" title="删除&#10;将所选项目移动到回收站或将其永久删除"><img src="'+mosparent._RootPath+'core/img/icon/del.png" style="width:32px;height:32px;margin:5px 0 0 0;" />'+
                '删除<i class="fa fa-sort-down" style="position: absolute;top: 85px;left: 375px;"></i>'+
           '</div>'+
           '<div class="rbbcbutton rbbcopyto" title="重命名&#10;重命名所选项目"><img src="'+mosparent._RootPath+'core/img/icon/rename.png" style="width:32px;height:32px;margin:5px 0 0 0;" />'+
                '重命名'+
           '</div>'+
        '</div>'+
        '<div class="rbbbottom">组织</div>'+
    '</div>'+
    '<div class="rbb rbnew">'+
        '<div class="rbbcontent">'+
            '<div class="rbbcbutton rbbnewfolder" title="新建文件夹&#10;新建文件夹"><img src="'+mosparent._RootPath+'core/img/icon/newfolder.png" style="width:32px;height:32px;margin:5px 2px 0 2px;" />'+
                '新建<br>文件夹'+
            '</div>'+
            '<div class="rbbcbutton rbbnewitem" style="width:84px;height:22px;margin:4px 0 0 0;" title="新建项目&#10;在当前位置中创建一个新项目"><img src="'+mosparent._RootPath+'core/img/icon/newitem.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                ' 新建项目<i class="fa fa-sort-down" style="position: absolute;top:35px;left:568px;"></i>'+
            '</div>'+
            '<div class="rbbcbutton rbbqsfw" style="width:84px;height:22px;margin:0;" title="轻松访问(未开发)&#10;敬请期待"><img src="'+mosparent._RootPath+'core/img/icon/qsfw.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                ' 轻松访问<i class="fa fa-sort-down" style="position: absolute;top:60px;left:568px;"></i>'+
            '</div>'+
        '</div>'+
        '<div class="rbbbottom">新建</div>'+
    '</div>'+
    '<div class="rbb rbopen">'+
        '<div class="rbbcontent">'+
            '<div class="rbbcbutton rbbattr" title="属性&#10;显示所选项目的属性"><img src="'+mosparent._RootPath+'core/img/icon/attr.png" style="width:32px;height:32px;margin:5px 2px 0 2px;" />'+
                '属性<i class="fa fa-sort-down" style="position: absolute;top:85px;left:612px;"></i>'+
            '</div>'+
            '<div class="rbbcbutton rbbopen" style="width:60px;height:22px;margin:4px 0 0 0;" title="打开&#10;使用默认程序打开所选文件"><img src="'+mosparent._RootPath+'core/img/icon/newitem.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                ' 打开<i class="fa fa-sort-down" style="position: absolute;top:35px;left:686px;"></i>'+
            '</div>'+
            '<div class="rbbcbutton rbbedit" style="width:50px;height:22px;margin:0;" title="编辑&#10;编辑所选文件"><img src="'+mosparent._RootPath+'core/img/icon/bj.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                ' 编辑'+
            '</div>'+
            '<div class="rbbcbutton rbbhistory" style="width:72px;height:22px;margin:0;" title="历史记录&#10;显示所选项目的历史记录"><img src="'+mosparent._RootPath+'core/img/icon/historylist.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                ' 历史记录'+
            '</div>'+
        '</div>'+
        '<div class="rbbbottom">打开</div>'+
    '</div>'+
    '<div class="rbb rbselect">'+
        '<div class="rbbcontent">'+
            '<div class="rbbcbutton rbbselectall" style="width:72px;height:22px;margin:4px 0 0 5px;" title="全部选择&#10;选择视图中的所有项目"><img src="'+mosparent._RootPath+'core/img/icon/selectall.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                ' 全部选择'+
            '</div>'+
            '<div class="rbbcbutton rbbselectcancel" style="width:72px;height:22px;margin:0 0 0 5px;" title="全部取消&#10;清除选定的内容"><img src="'+mosparent._RootPath+'core/img/icon/selectcancel.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                ' 全部取消'+
            '</div>'+
            '<div class="rbbcbutton rbbantiselect" style="width:72px;height:22px;margin:0 0 0 5px;" title="反向选择&#10;反转当前的选定内容"><img src="'+mosparent._RootPath+'core/img/icon/antiselect.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                ' 反向选择'+
            '</div>'+
        '</div>'+
        '<div class="rbbbottom">选择</div>'+
    '</div>';
    $(".content.rbhome").empty().append(rbhome);
    var rbshare=''+
    '<div class="rbb rbsend">'+
        '<div class="rbbcontent">'+
            '<div class="rbbcbutton rbbshare" title="共享&#10;选择一个应用以共享所选文件"><img src="'+mosparent._RootPath+'core/img/icon/rbbshare.png" style="width:32px;height:32px;margin:5px 2px 0 2px;" />'+
                '共享'+
            '</div>'+
            '<div class="rbbcbutton rbbsendemail" title="发送电子邮件&#10;通过电子邮件发送所选项目"><img src="'+mosparent._RootPath+'core/img/icon/email.png" style="width:48px;height:42px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                '发送<br>电子邮件'+
            '</div>'+
            '<div class="rbbcbutton rbbzip" title="压缩&#10;创建一个包含所选项目的zip&#10;压缩文件夹"><img src="'+mosparent._RootPath+'core/img/icon/zip.png" style="width:32px;height:32px;margin:5px 2px 0 2px;" />'+
                '压缩'+
           '</div>'+
           '<div class="rbbcbutton rbbprint" style="width:55px;height:22px;margin:4px 0 0 10px;" title="打印&#10;将所选文件发送到打印机"><img src="'+mosparent._RootPath+'core/img/icon/printer.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                ' 打印'+
            '</div>'+
            '<div class="rbbcbutton rbbfax" style="width:55px;height:22px;margin:0 0 0 10px;" title="传真&#10;传真所选项目"><img src="'+mosparent._RootPath+'core/img/icon/fax.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                ' 传真'+
            '</div>'+
            '<div style="width:105px;height:22px;margin:2px 0 0 0;float:left;">'+
                '<div class="rbbcbutton rbbfsgn" title="刻录到光盘(未开发)&#10;敬请期待"><img src="'+mosparent._RootPath+'core/img/icon/fsgn.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                    ' 刻录到光盘'+
                '</div>'+
            '</div>'+
        '</div>'+
        '<div class="rbbbottom">发送</div>'+
    '</div>'+
    '<div class="rbb rbrightshare">'+
        '<div class="rbbcontent">'+
            '<div style="float:left;max-width:150px;height:60px;border:1px solid #c7c7c7;background-color:#fff;margin:6px 0 0 6px;">'+
                '<div class="rbbcbutton rbbaddgroup" style="width:147px;height:22px;margin-top:6px;" title="创建或加入组(未开发)&#10;敬请期待"><img src="'+mosparent._RootPath+'core/img/icon/fsgn.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                        ' 创建或加入组'+
                '</div>'+
                '<div class="rbbcbutton rbbspecialuser" style="width:147px;height:22px;margin:0;" title="特定用户&#10;对特定用户共享所选项目"><img src="'+mosparent._RootPath+'core/img/icon/specialuser.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                        ' 特定用户...'+
                '</div>'+
            '</div>'+
            '<div class="rbbcbutton rbbdelshare" title="删除访问&#10;停止共享选定的项目"><img src="'+mosparent._RootPath+'core/img/icon/lock.png" style="width:32px;height:32px;margin:5px 2px 0 2px;" />'+
                '删除<br>访问'+
            '</div>'+
        '</div>'+
        '<div class="rbbbottom">共享</div>'+
    '</div>'+
    '<div class="rbb rbadsafe">'+
        '<div class="rbbcontent">'+
            '<div class="rbbcbutton rbbadsafe" title="高级安全&#10;手动设置所选项目的高级共&#10;享安全"><img src="'+mosparent._RootPath+'core/img/icon/adsafe.png" style="width:32px;height:32px;margin:5px 15px 4px 12px;" />'+
                '高级安全'+
            '</div>'+
        '</div>'+
        '<div class="rbbbottom"></div>'+
    '</div>';
    $(".content.rbshare").empty().append(rbshare);
    var rbview=''+
    '<div class="rbb rbpane">'+
        '<div class="rbbcontent">'+
            '<div class="rbbcbutton rbbpane" title="导航窗格&#10;选择要显示在导航窗格中&#10;的内容"><img src="'+mosparent._RootPath+'core/img/icon/pane.png" style="width:32px;height:32px;margin:5px 15px 4px 12px;" />'+
                '导航窗格<i class="fa fa-sort-down" style="position: absolute;top:88px;left:32px;"></i>'+
            '</div>'+
            '<div class="rbbcbutton rbbpreview" style="width:80px;height:22px;margin:18px 0 0 0;" title="预览窗格&#10;显示或隐藏预览窗格"><img src="'+mosparent._RootPath+'core/img/icon/preview.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                ' 预览窗格'+
            '</div>'+
            '<div class="rbbcbutton rbbdetail" style="width:97px;height:22px;margin:10px 0 0 0;" title="详细信息窗格&#10;显示或隐藏详细信息窗格"><img src="'+mosparent._RootPath+'core/img/icon/detail.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                ' 详细信息窗格'+
            '</div>'+
        '</div>'+
        '<div class="rbbbottom">窗格</div>'+
    '</div>'+
    '<div class="rbb rblayout">'+
        '<div class="rbbcontent">'+
            '<div style="float:left;width:240px;height:72px;border:1px solid #c7c7c7;background-color:#fff;margin:6px 0 0 6px;overflow-y:auto;">'+
                '<div class="rbbcbutton hugeicon" style="width:72px;height:22px;margin:0;"><img src="'+mosparent._RootPath+'core/img/icon/hugeicon.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                    ' 超大图标'+
                '</div>'+
                '<div class="rbbcbutton largeicon" style="width:72px;height:22px;margin:0;"><img src="'+mosparent._RootPath+'core/img/icon/largeicon.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                    ' 大图标'+
                '</div>'+
                '<div class="rbbcbutton middleicon" style="width:72px;height:22px;margin:0;"><img src="'+mosparent._RootPath+'core/img/icon/middleicon.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                    ' 中图标'+
                '</div>'+
                '<div class="rbbcbutton smallicon" style="width:72px;height:22px;margin:0;"><img src="'+mosparent._RootPath+'core/img/icon/smallicon.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                    ' 小图标'+
                '</div>'+
                '<div class="rbbcbutton listicon" style="width:72px;height:22px;margin:0;"><img src="'+mosparent._RootPath+'core/img/icon/listicon.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                    ' 列表'+
                '</div>'+
                '<div class="rbbcbutton detailicon" style="width:72px;height:22px;margin:0;"><img src="'+mosparent._RootPath+'core/img/icon/detailicon.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                    ' 详细信息'+
                '</div>'+
                '<div class="rbbcbutton tileicon" style="width:72px;height:22px;margin:0;"><img src="'+mosparent._RootPath+'core/img/icon/tileicon.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                    ' 平铺'+
                '</div>'+
                '<div class="rbbcbutton conicon" style="width:72px;height:22px;margin:0;"><img src="'+mosparent._RootPath+'core/img/icon/conicon.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                    ' 内容'+
                '</div>'+
            '</div>'+
        '</div>'+
        '<div class="rbbbottom">布局</div>'+
    '</div>'+
    '<div class="rbb rbcurview">'+
        '<div class="rbbcontent">'+
            '<div class="rbbcbutton rbbsort" title="排序方式&#10;按列对此视图中的项目进行&#10;排序"><img src="'+mosparent._RootPath+'core/img/icon/rbbsort.png" style="width:32px;height:32px;margin:5px 15px 4px 12px;" />'+
                '排序方式<i class="fa fa-sort-down" style="position: absolute;top:88px;left:445px;"></i>'+
            '</div>'+
            '<div style="width:100px;height:22px;margin:0 0 4px;float:left;">'+
                '<div class="rbbcbutton rbbnewitem" style="width:84px;height:22px;margin:4px 0 0 0;" title="分组依据&#10;按列对此视图中的项目进行&#10;分组"><img src="'+mosparent._RootPath+'core/img/icon/rbbfz.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                    ' 分组依据<i class="fa fa-sort-down" style="position: absolute;top:35px;left:548px;"></i>'+
                '</div>'+
            '</div>'+
            '<div style="width:100px;height:22px;margin:0 0 4px;float:left;">'+
                '<div class="rbbcbutton rbbqsfw" style="width:72px;height:22px;margin:4px 0 0 0;" title="添加列&#10;敬请期待"><img src="'+mosparent._RootPath+'core/img/icon/rbbtjl.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                    ' 添加列<i class="fa fa-sort-down" style="position: absolute;top:62px;left:536px;"></i>'+
                '</div>'+
            '</div>'+
            '<div class="rbbcbutton rbbqsfw" style="width:160px;height:22px;margin:2px 0 0 0;" title="将所有列调整为合适大小&#10;敬请期待"><img src="'+mosparent._RootPath+'core/img/icon/rbbtzl.png" style="width:16px;height:16px;vertical-align:middle;margin:-3px 0 0 2px;" />'+
                ' 将所有列调整为合适大小'+
            '</div>'+
        '</div>'+
        '<div class="rbbbottom">当前视图</div>'+
    '</div>'+
    '<div class="rbb rbshowhide">'+
        '<div class="rbbcontent">'+
            '<div class="rbbxmxz">'+
                '<div style="float:left;width:85px;height:22px;margin:2px 0;" title="项目复选框&#10;使用项目复选框可轻松选择&#10;多个项目。"><label id="itemselect"><input type="checkbox"/><div class="check_box" />项目复选框</label></div>'+
                '<div style="float:left;width:85px;height:22px;margin:2px 0;" title="文件扩展名&#10;显示或隐藏添加到文件末&#10;尾、用于指定文件类型或格&#10;式的字符集。"><label id="fileextname"><input type="checkbox" checked/><div class="check_box" />文件扩展名</label></div>'+
                '<div style="float:left;width:85px;height:22px;margin:2px 0;" title="隐藏的项目&#10;显示或隐藏标记为隐藏的文&#10;件和文件夹。"><label id="itemhidden"><input type="checkbox" checked/><div class="check_box" />隐藏的项目</label></div>'+
            '</div>'+
            '<div class="rbbcbutton rbbycxm" title="隐藏所选项目&#10;隐藏所选的文件夹或文件"><img src="'+mosparent._RootPath+'core/img/icon/ycxm.png" style="width:32px;height:32px;vertical-align:middle;margin:5px 10px 4px 9px;" />'+
                '隐藏<br>所选项目'+
            '</div>'+
        '</div>'+
        '<div class="rbbbottom">显示/隐藏</div>'+
    '</div>';
     $(".content.rbview").empty().append(rbview);
    var username=mosparent.getcookie("mos_user_id");
    var userDataSet=mosparent.getuserinfo(username);//当前用户数据库
    var desktopDataSet=mosparent.getdesktopdata(username);//当前用户桌面信息数据库 
    var ifrmindex = parent.layer.index; //先得到当前iframe层的索引
    var ifrmid="mlayer-iframe"+ifrmindex;//当前iframe的ID值
    var layername=parent.$("#mlayer"+ifrmindex).attr("name");
    var ribbon=mosparent._usersetupDataSet["system"]["items"][1]["item"]["ribbon"];//用户功能区的设置
    var ribbonshow=ribbon["show"];
    var ribbonview=ribbon["view"];//查看-布局
    var rbactiveclass="";  
    $(".base").bind("click",function(){
        mosparent.menuClose();//关闭开始菜单
        mosparent.commandCenterClose();//关闭消息中心
    });      
    if(ribbonshow){
        $(".rbcontent")[0].style.display="block";
        $(".rbupdown").find("i").removeClass("icon-down").addClass("icon-up");
        $(".rbupdown").attr("title","最小化功能区\n仅在功能区上显示选项卡名称");
        $(".rbbutton").removeClass("active");
        $(".rbhome").addClass("active");
        rbactiveclass="rbhome";
        $(".content").hide();
        $(".rbcontent ."+rbactiveclass).show();
        $(".rbbcbutton").removeClass("active");
        $("."+ribbonview).addClass("active");
    }else{
        $(".rbcontent")[0].style.display="none";
        $(".rbpdown").find("i").removeClass("icon-up").addClass("icon-down");
        $(".rbupdown").attr("title","展开功能区\n显示功能区,这样即使在单\n击某个某个命令后,功能区\n也会始终展开。");
        $(".rbbutton").removeClass("active");
    }
    resizetree();
    $(".rblayout .rbbcbutton").bind("click",function(){//查看-布局
        $(".rbbcbutton").removeClass("active");
        $("."+$(this)[0]["classList"][1]).addClass("active");
        ribbon["view"]=$(this)[0]["classList"][1];
        mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存
    });
    $(".rbbutton").bind("click",function(){
        $(".rbbutton").removeClass("active");
        $(this).addClass("active");
        rbactiveclass=$(this)[0]["className"].replace(/rbbutton/g, "").replace(/active/g, "").replace(/ /g, "");
        $(".content").hide();
        $(".rbcontent ."+rbactiveclass).show();
    });
    $(".xm").attr("src",mosparent._RootPath+"core/img/icon/1_open.png")
    $(".fmmiddle")[0].onmousedown = function(e) {//中间移动线鼠标按下并移动时
        var disX = (e || event).clientX;//鼠标当前x坐标 
        var middleleft=$(".fmmiddle")[0].offsetLeft;//移动线的原始左边距
        var rightwidth=$(".fmright")[0].offsetWidth;//右边框架原始宽度
        document.onmousemove = function(e) {
            $(".fmleft")[0].style.width=middleleft+(e || event).clientX-disX+"px";
            $(".fmright")[0].style.width=rightwidth-((e || event).clientX-disX)+"px";
            return false 
        }; 
        document.onmouseup = function() { 
            document.onmousemove = null; 
            document.onmouseup = null; 
            $(".fmmiddle")[0].releaseCapture && $(".fmmiddle")[0].releaseCapture() 
        }; 
        $(".fmmiddle")[0].setCapture && $(".fmmiddle")[0].setCapture(); 
        return false 
    };
    $(".fmdownlist").hide();
    $(".rbupdown").bind("click",function(){
        $(".rbcontent").toggle();
        if($(this).find("i").hasClass("icon-down")){
            $(this).find("i").removeClass("icon-down").addClass("icon-up");
            $(".rbupdown").attr("title","最小化功能区\n仅在功能区上显示选项卡名称");
            $(".rbbutton").removeClass("active");
            if(rbactiveclass==""){rbactiveclass="rbhome"}
            $("."+rbactiveclass).addClass("active");
        }else{
            $(this).find("i").removeClass("icon-up").addClass("icon-down");
            $(".rbupdown").attr("title","展开功能区\n显示功能区,这样即使在单\n击某个某个命令后,功能区\n也会始终展开。");
            $(".rbbutton").removeClass("active");
        }
        var rbshow=false;
        $(".rbcontent")[0].style.display=="none"?rbshow=false:rbshow=true;
        ribbon["show"]=rbshow;
        mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存
        resizetree();
    });
    $(".fmpathfrm").click(function(){
        //$(".fmpathfrm").hide();
       // $(".fmpathtext").focus();
    });
    function resizetree(){//拖动
        $(".fmleft")[0].style.height=parseInt($(".base")[0].clientHeight-$(".rbtop")[0].clientHeight-$(".rbcontent")[0].clientHeight-62)+"px";
        $(".fmmiddle")[0].style.height=parseInt($(".base")[0].clientHeight-$(".rbtop")[0].clientHeight-$(".rbcontent")[0].clientHeight-62)+"px";
        $(".fmright")[0].style.height=parseInt($(".base")[0].clientHeight-$(".rbtop")[0].clientHeight-$(".rbcontent")[0].clientHeight-62)+"px";
    };
    $(document).on('click',function(e){
        $(".fmdownlist").hide();//鼠标点击任何地方时隐藏
        $(".fmpdownlist").hide();//鼠标点击任何地方时隐藏
    });
    var fmltreesetting={
        view:{
            showLine: false,
			addDiyDom: fmltreeDom
        },
        callback: {
            onClick:fmltreeOnClick,
            beforeExpand:fmltreeBeforeExpand
        },
        data: {
            key: {
                title:"tip"//提示信息对应的json的key
            }
        },
        iconroot:mosparent._RootPath
    };
    var fmrtreesetting={
        view:{
            showLine: false,
            dblClickExpand: false,
            addDiyDom: fmrtreeDom
        },
        callback: {
            onClick:fmrtreeOnClick,
            onDblClick:fmrtreeonDblClick
        },
        data: {
            key: {
                title:"tips"//提示信息对应的json的key
            }
        },
        iconroot:mosparent._RootPath
    };
    var fmlnodes=[];
    $.ajaxSettings.async = false;//同步加载
        if(mosparent.netfileexist(mosparent._RootPath+"data/system/files.json")){
            $.getJSON(mosparent._RootPath+"data/system/files.json?ran="+Math.random(),function(data){//读取基本提示数据库文件
                fmlnodes=data;
            });
        }
    $.ajaxSettings.async = true;
    var viewrecord={};
    viewrecord["curindex"]=0;
    viewrecord["records"]=[];
    $.fn.zTree.init($("#fmltree"),fmltreesetting, fmlnodes);
    var fmltreeObj = $.fn.zTree.getZTreeObj("fmltree");
    $("#fmltree").hover(function () {
			if (!$("#fmltree").hasClass("showIcon")) {
				$("#fmltree").addClass("showIcon");
			}
		}, function() {
            $("#fmltree").removeClass("showIcon");
	});
    $(".fmup").click(function(){  
        var node = fmltreeObj.getNodeByTId($(".fmfrmbtntext:last").prev().prev().attr("tId"));
        if(node!==null){
            showfilelistbynode($(".fmfrmbtntext:last").prev().prev(),node);
            backprevup(node["tId"],viewrecord);
        }
    });
    $(".fmprev").click(function(){
        var prevnode=fmltreeObj.getNodeByTId(viewrecord["records"][viewrecord["curindex"]-1]);
        var newindex=viewrecord["curindex"]-1;
        if(newindex>=0){
            showfilelist(fmrtreesetting,prevnode["children"]);
            $(".fmpathfrm").show();
            var node = prevnode.getPath();//获取 treeNode 节点的所有父节点（包括自己）。
            var fmpathfrmhtml='';
            for(var i=0;i<node.length;i++){
                if(i==0){
                    fmpathfrmhtml+='<div class="fmfrmbtn" style="background: url('+mosparent._RootPath+node[node.length-1]["icon"]+') center center no-repeat;background-size:16px 16px;"></div>';
                    fmpathfrmhtml+='<div class="fmfrmbtnexp"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';
                    fmpathfrmhtml+='<div class="fmfrmbtntext" tId="'+node[i]["tId"]+'">'+node[i]["name"]+node[i]["sysname"]+'</div>';
                    if("children" in node[i]){
                        if(node[i]["children"].length>0){fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+node[i]["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';}
                    }
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.icon").attr("src",mosparent._RootPath+node[node.length-1]["icon"]);
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.newfolder").attr("src",mosparent._RootPath+"core/img/icon/wjj.png");
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>.mtitle")[0].innerHTML=node[node.length-1]["name"]+node[node.length-1]["sysname"];
                }else{
                    if(i>1){
                        fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+node[i-1]["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';
                    }
                    fmpathfrmhtml+='<div class="fmfrmbtntext" tId="'+node[i]["tId"]+'">'+node[i]["name"]+node[i]["sysname"]+'</div>';
                    if(i==node.length-1){
                        if("children" in node[i]){
                            if(node[i]["children"].length>0){fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+node[i]["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';}
                        }
                    }
                }
            }
            $(".fmpathfrm").empty().append(fmpathfrmhtml);
            exptxtclick();
            $(".fmbottom>.totalitem")[0].innerText=prevnode.children.length;
            viewrecord["curindex"]=newindex;
            if(newindex>0){
                $(".fmprev").attr("title","返回到\""+fmltreeObj.getNodeByTId(viewrecord["records"][newindex-1])["name"]+fmltreeObj.getNodeByTId(viewrecord["records"][newindex-1])["sysname"]+"\"");
                $(".fmnext").attr("title","前进到\""+fmltreeObj.getNodeByTId(viewrecord["records"][newindex+1])["name"]+fmltreeObj.getNodeByTId(viewrecord["records"][newindex+1])["sysname"]+"\"");
            }else{
                $(".fmprev").attr("title","后退");
            }
            fmltreeObj.cancelSelectedNode();//先取消所有的选中状态
            fmltreeObj.selectNode(prevnode,true);//将指定ID的节点选中
            //将叶节点隐藏
            for(var p in prevnode["children"]){
                if(prevnode["children"][p]["size"]!==undefined && prevnode["children"][p]["size"]!==""){
                    fmltreeObj.hideNode(prevnode["children"][p]);
                }
            }
            if(prevnode.level>0){
                fmltreeObj.expandNode(prevnode,true,false,false);//将指定ID节点展开
            }
        }
    });
    $(".fmdown ").click(function(){
        var fmdownlisthtml='';
        for(var i=viewrecord["records"].length-1;i>=0;i--){
            var node=fmltreeObj.getNodeByTId(viewrecord["records"][i]); 
            fmdownlisthtml+='';
            if(i==viewrecord["curindex"]){
                fmdownlisthtml+='<div class="fmdownlistitem active" index="'+i+'" tId="'+node["tId"]+'"><div class="fmdownlisticon"><i class="fa fa-check"></i></div>';
            }else{
                fmdownlisthtml+='<div class="fmdownlistitem" index="'+i+'"  tId="'+node["tId"]+'"><div class="fmdownlisticon"></div>';
            }
            fmdownlisthtml+=node["name"]+node["sysname"]+'</div>';

        }
        $(".fmdownlist").empty().append(fmdownlisthtml);
        var thisAbsolute=mosparent.getAbsolute($(".base")[0],$(".fmtop")[0]);//元素位置
        $(".fmdownlist")[0].style.top=parseInt(thisAbsolute.top+30)+"px";
        if(fmdownlisthtml==''){
            $(".fmdownlist").hide();
        }else{
            $(".fmpdownlist").hide();
            $(".fmdownlist").toggle();
        }
        $(".fmdownlistitem").click(function(){
            var curnode=fmltreeObj.getNodeByTId($(this).attr("tId"));
            showfilelist(fmrtreesetting,curnode["children"]);
            $(".fmpathfrm").show();
            var node = curnode.getPath();//获取 node 节点的所有父节点（包括自己）。
            var fmpathfrmhtml='';
            for(var i=0;i<node.length;i++){
                if(i==0){
                    fmpathfrmhtml+='<div class="fmfrmbtn" style="background: url('+mosparent._RootPath+node[node.length-1]["icon"]+') center center no-repeat;background-size:16px 16px;"></div>';
                    fmpathfrmhtml+='<div class="fmfrmbtnexp"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';
                    fmpathfrmhtml+='<div class="fmfrmbtntext" tId="'+node[i]["tId"]+'">'+node[i]["name"]+node[i]["sysname"]+'</div>';
                    if("children" in node[i]){
                        if(node[i]["children"].length>0){fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+node[i]["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';}
                    }
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.icon").attr("src",mosparent._RootPath+node[node.length-1]["icon"]);
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.newfolder").attr("src",mosparent._RootPath+"core/img/icon/wjj.png");
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>.mtitle")[0].innerHTML=node[node.length-1]["name"]+node[node.length-1]["sysname"];
                }else{
                    if(i>1){
                        fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+node[i-1]["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';
                    }
                    fmpathfrmhtml+='<div class="fmfrmbtntext" tId="'+node[i]["tId"]+'">'+node[i]["name"]+node[i]["sysname"]+'</div>';
                    if(i==node.length-1){
                        if("children" in node[i]){
                            if(node[i]["children"].length>0){fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+node[i]["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';}
                        }
                    }
                }
            }
            $(".fmpathfrm").empty().append(fmpathfrmhtml);
            exptxtclick();
            $(".fmbottom>.totalitem")[0].innerText=curnode.children.length;
            viewrecord["curindex"]=parseInt($(this).attr("index"));
            if(viewrecord["curindex"]>0){
                if(viewrecord["curindex"]==viewrecord["records"].length-1){
                    $(".fmnext").attr("title","前进");
                }else{
                    $(".fmprev").attr("title","返回到\""+fmltreeObj.getNodeByTId(viewrecord["records"][viewrecord["curindex"]-1])["name"]+fmltreeObj.getNodeByTId(viewrecord["records"][viewrecord["curindex"]-1])["sysname"]+"\"");
                    $(".fmnext").attr("title","前进到\""+fmltreeObj.getNodeByTId(viewrecord["records"][viewrecord["curindex"]+1])["name"]+fmltreeObj.getNodeByTId(viewrecord["records"][viewrecord["curindex"]+1])["sysname"]+"\"");
                }     
            }else{
                $(".fmprev").attr("title","后退");
            }
            fmltreeObj.cancelSelectedNode();//先取消所有的选中状态
            fmltreeObj.selectNode(curnode,true);//将指定ID的节点选中
            //将叶节点隐藏
            for(var p in curnode["children"]){
                if(curnode["children"][p]["size"]!==undefined && curnode["children"][p]["size"]!==""){
                    fmltreeObj.hideNode(curnode["children"][p]);
                }
            }
            if(curnode.level>0){
                fmltreeObj.expandNode(curnode,false,false,false);//将指定ID节点展开
            }
        });
        $(".fmdownlistitem").mouseenter(function(){
            if(parseInt($(this).attr("index"))>viewrecord["curindex"]){
                $(this).find(".fmdownlisticon")[0]["innerHTML"]='<i class="iconfont icon-arrowright"></i>';
            }
            if(parseInt($(this).attr("index"))<viewrecord["curindex"]){
                $(this).find(".fmdownlisticon")[0]["innerHTML"]='<i class="iconfont icon-arrowleft"></i>';
            }
        });
        $(".fmdownlistitem").mouseout(function(){
            if(parseInt($(this).attr("index"))!==viewrecord["curindex"]){
                $(this).find(".fmdownlisticon")[0]["innerHTML"]='';
            }
        });
        return false;//取消隐藏冒泡
    });
    $(".fmnext").click(function(){
        var nextnode=fmltreeObj.getNodeByTId(viewrecord["records"][viewrecord["curindex"]+1]);
        var newindex=viewrecord["curindex"]+1;
        if(newindex<=viewrecord["records"].length-1){
            showfilelist(fmrtreesetting,nextnode["children"]);
            $(".fmpathfrm").show();
            var node = nextnode.getPath();//获取 treeNode 节点的所有父节点（包括自己）。
            var fmpathfrmhtml='';
            for(var i=0;i<node.length;i++){
                if(i==0){
                    fmpathfrmhtml+='<div class="fmfrmbtn" style="background: url('+mosparent._RootPath+node[node.length-1]["icon"]+') center center no-repeat;background-size:16px 16px;"></div>';
                    fmpathfrmhtml+='<div class="fmfrmbtnexp"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';
                    fmpathfrmhtml+='<div class="fmfrmbtntext" tId="'+node[i]["tId"]+'">'+node[i]["name"]+node[i]["sysname"]+'</div>';
                    if("children" in node[i]){
                        if(node[i]["children"].length>0){fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+node[i]["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';}
                    }
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.icon").attr("src",mosparent._RootPath+node[node.length-1]["icon"]);
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.newfolder").attr("src",mosparent._RootPath+"core/img/icon/wjj.png");
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>.mtitle")[0].innerHTML=node[node.length-1]["name"]+node[node.length-1]["sysname"];
                }else{
                    if(i>1){
                        fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+node[i-1]["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';
                    }
                    fmpathfrmhtml+='<div class="fmfrmbtntext" tId="'+node[i]["tId"]+'">'+node[i]["name"]+node[i]["sysname"]+'</div>';
                    if(i==node.length-1){
                        if("children" in node[i]){
                            if(node[i]["children"].length>0){fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+node[i]["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';}
                        }
                    }
                }
            }
            $(".fmpathfrm").empty().append(fmpathfrmhtml);
            exptxtclick();
            $(".fmbottom>.totalitem")[0].innerText=nextnode.children.length;
            viewrecord["curindex"]=newindex;
            if(newindex<viewrecord["records"].length-1){
                $(".fmnext").attr("title","前进到\""+fmltreeObj.getNodeByTId(viewrecord["records"][newindex+1])["name"]+fmltreeObj.getNodeByTId(viewrecord["records"][newindex+1])["sysname"]+"\"");
            }else{
                $(".fmnext").attr("title","前进");
            }
            fmltreeObj.cancelSelectedNode();//先取消所有的选中状态
            fmltreeObj.selectNode(nextnode,true);//将指定ID的节点选中
            //将叶节点隐藏
            for(var p in nextnode["children"]){
                if(nextnode["children"][p]["size"]!==undefined && nextnode["children"][p]["size"]!==""){
                    fmltreeObj.hideNode(nextnode["children"][p]);
                }
            }
            if(nextnode.level>0){
                fmltreeObj.expandNode(nextnode,true,false,false);//将指定ID节点展开
            }
        }
    });

    function backprevup(tId,viewrecord){
        if(tId!==viewrecord["records"][viewrecord["curindex"]]){
            $(".fmprev").attr("title","返回到\""+fmltreeObj.getNodeByTId(viewrecord["records"][viewrecord["curindex"]])["name"]+fmltreeObj.getNodeByTId(viewrecord["records"][viewrecord["curindex"]])["sysname"]+"\"");
            viewrecord["curindex"]=viewrecord["records"].length;
            viewrecord["records"].push(tId);
        }
        if($(".fmfrmbtntext:last").prev().prev()[0]["className"]!=="fmfrmbtn"){
            $(".fmup").attr("title","上移到\""+fmltreeObj.getNodeByTId($(".fmfrmbtntext:last").prev().prev().attr("tId"))["name"]+fmltreeObj.getNodeByTId($(".fmfrmbtntext:last").prev().prev().attr("tId"))["sysname"]+"\"");
        }else{
            $(".fmup").attr("title","上移一级");
        }
    };
    switch(layername){
        case "wjglq":
            fmltreeObj.selectNode(fmltreeObj.getNodes()[0]);
            viewrecord["curindex"]=0;
            viewrecord["records"].push(fmltreeObj.getNodeByParam("id","1",null)["tId"]);
            fminit();   
        break;
        case "mycomputer":
            fmltreeObj.selectNode(fmltreeObj.getNodes()[1]);
            viewrecord["curindex"]=0;
            viewrecord["records"].push(fmltreeObj.getNodeByParam("id","2",null)["tId"]);
            fminit();   
        break;
        case "network":
            fmltreeObj.selectNode(fmltreeObj.getNodes()[2]);
            viewrecord["curindex"]=0;
            viewrecord["records"].push(fmltreeObj.getNodeByParam("id","3",null)["tId"]);
            fminit(); 
        break;
        case "recycle":
            fmltreeObj.selectNode(fmltreeObj.getNodes()[3]);
            viewrecord["curindex"]=0;
            viewrecord["records"].push(fmltreeObj.getNodeByParam("id","4",null)["tId"]);
            fminit();
        break;
    }
    function fminit(){
        var sNodes = fmltreeObj.getSelectedNodes();
        var node = sNodes[0].getPath();//获取 treeNode 节点的所有父节点（包括自己）。
        var fmpathfrmhtml='';
        fmpathfrmhtml+='<div class="fmfrmbtn" style="background: url('+mosparent._RootPath+node[0]["icon"]+') center center no-repeat;background-size:16px 16px;"></div>';
        fmpathfrmhtml+='<div class="fmfrmbtnexp"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';
        fmpathfrmhtml+='<div class="fmfrmbtntext" tId="'+sNodes[0]["tId"]+'">'+node[0]["name"]+node[0]["sysname"]+'</div>';
        if("children" in node[0]){
            if(node[0]["children"].length>0){fmpathfrmhtml+='<div class="fmfrmbtnexp"  tId="'+sNodes[0]["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';}
        }
        parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.icon").attr("src",mosparent._RootPath+node[0]["icon"]);
        parent.$("#mlayer"+ifrmindex+">.mlayer-title>.mtitle")[0].innerHTML=node[0]["name"]+node[0]["sysname"];
        $(".fmpathfrm").empty().append(fmpathfrmhtml);
        showfilelist(fmrtreesetting,sNodes[0]["children"]);
        exptxtclick();
        $(".fmbottom>.totalitem")[0].innerText=sNodes[0].children.length;

    };
    function fmltreeBeforeExpand(treeId, treeNode) {
        //将叶节点隐藏
        for(var p in treeNode["children"]){
            if(treeNode["children"][p]["size"]!==undefined && treeNode["children"][p]["size"]!==""){
                fmltreeObj.hideNode(treeNode["children"][p]);
            }
        }
        return true;
    };
    function fmltreeOnClick(event,treeId,treeNode) {
        //treeNode-当前被选中的节点数据集合
        $("#fmltree").hover(function () {
			if (!$("#fmltree").hasClass("showIcon")) {
				$("#fmltree").addClass("showIcon");
			}
		});
        $(".fmpathfrm").show(); 
        var node = treeNode.getPath();//获取 treeNode 节点的所有父节点（包括自己）。
        var sindex = fmltreeObj.getNodeIndex(treeNode);//获取某节点在同级节点中的序号（从0开始） 
        $(".fmbottom>.totalitem")[0].innerText=treeNode.children.length;
        var fmpathfrmhtml='';
        for(var i=0;i<node.length;i++){
            if(node.length==1){//点击的是根目录
                fmpathfrmhtml+='<div class="fmfrmbtn" style="background: url('+mosparent._RootPath+node[0]["icon"]+') center center no-repeat;background-size:16px 16px;"></div>';
                fmpathfrmhtml+='<div class="fmfrmbtnexp"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';
                fmpathfrmhtml+='<div class="fmfrmbtntext" tId="'+node[0]["tId"]+'">'+node[0]["name"]+node[0]["sysname"]+'</div>';
                if("children" in node[0]){
                    if(node[i]["children"].length>0){fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+node[0]["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';}
                }
                if(sindex==0){//点击的是"快速访问"
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.icon").attr("src",mosparent._RootPath+"core/img/icon/wjglq.png");
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.newfolder").attr("src",mosparent._RootPath+"core/img/icon/newfolder-s.png");
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>.mtitle")[0].innerHTML="文件资源管理器";
                }else{
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.icon").attr("src",mosparent._RootPath+node[i]["icon"]);
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.newfolder").attr("src",mosparent._RootPath+"core/img/icon/newfolder-s.png");
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>.mtitle")[0].innerHTML=node[i]["name"]+node[0]["sysname"];
                }
                $(".fmup").attr("title","上移一级");
            }else{
                if(node[0]["name"]=="快速访问"){
                    if(i==0){continue;}
                    fmpathfrmhtml+='<div class="fmfrmbtn" style="background: url('+mosparent._RootPath+node[i]["icon"]+') center center no-repeat;background-size:16px 16px;"></div>';
                    var nodes=[];
                    fmpathfrmhtml+='<div class="fmfrmbtnexp"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';
                    for(var key in node[i]["qpath"]){
                        node[i]["qpath"][key]["pid"]=="0"?nodes=fmltreeObj.getNodeByParam("id",node[i]["qpath"][key]["id"],null):nodes=fmltreeObj.getNodeByParam("id",node[i]["qpath"][key]["id"],fmltreeObj.getNodeByParam("id",node[i]["qpath"][key]["pid"], null));
                        fmpathfrmhtml+='<div class="fmfrmbtntext" tId="'+nodes["tId"]+'">'+nodes["name"]+nodes["sysname"]+'</div>'; 
                        if(nodes["children"].length>0){
                            fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+nodes["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>'; 
                        }   
                    }
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.icon").attr("src",mosparent._RootPath+node[node.length-1]["icon"]);
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.newfolder").attr("src",mosparent._RootPath+"core/img/icon/wjj.png");
                    parent.$("#mlayer"+ifrmindex+">.mlayer-title>.mtitle")[0].innerHTML=node[node.length-1]["name"]+node[node.length-1]["sysname"];
                }else{
                    if(i==0){
                        fmpathfrmhtml+='<div class="fmfrmbtn" style="background: url('+mosparent._RootPath+node[node.length-1]["icon"]+') center center no-repeat;background-size:16px 16px;"></div>';
                        fmpathfrmhtml+='<div class="fmfrmbtnexp"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';
                        fmpathfrmhtml+='<div class="fmfrmbtntext" tId="'+node[i]["tId"]+'">'+node[i]["name"]+node[i]["sysname"]+'</div>';
                        if("children" in node[i]){
                            if(node[i]["children"].length>0){fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+node[i]["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';}
                        }
                        parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.icon").attr("src",mosparent._RootPath+node[node.length-1]["icon"]);
                        parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.newfolder").attr("src",mosparent._RootPath+"core/img/icon/wjj.png");
                        parent.$("#mlayer"+ifrmindex+">.mlayer-title>.mtitle")[0].innerHTML=node[node.length-1]["name"]+node[node.length-1]["sysname"];
                    }else{
                        if(i>1){
                            fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+node[i-1]["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';
                        }
                        fmpathfrmhtml+='<div class="fmfrmbtntext" tId="'+node[i]["tId"]+'">'+node[i]["name"]+node[i]["sysname"]+'</div>';
                        if(i==node.length-1){
                            if("children" in node[i]){
                                if(node[i]["children"].length>0){fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+node[i]["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';}
                            }
                        }
                    }
                }
            }
        }
        $(".fmpathfrm").empty().append(fmpathfrmhtml);
        showfilelist(fmrtreesetting,treeNode["children"]);
        backprevup(treeNode["tId"],viewrecord);
        exptxtclick();
    };
    function exptxtclick(){
        $(".fmfrmbtnexp").off("click").click(function(){
            var fmdownlisthtml='';
            var curnode = fmltreeObj.getNodeByTId($(this).attr("tId")); 
            if(curnode!==null){//不是第一个弹出框按钮
                var node=curnode["children"];
                for(var i=0;i<node.length;i++){
                    var nodename=node[i]["name"]+node[i]["sysname"];
                    if(node[i]["size"]!==undefined && node[i]["size"]!==""){continue;}
                    if($($(this)[0].nextSibling).length>0){
                        if($($(this)[0].nextSibling)[0].innerText==nodename){
                            fmdownlisthtml+='<div class="fmpdownlistitem active" index="'+i+'" tId="'+node[i]["tId"]+'"><div class="fmpdownlisticon"><img src="'+mosparent._RootPath+node[i]["icon"]+'" style="width:16px;height:16px;margin-top:4px;" /></div>';
                        }else{
                            fmdownlisthtml+='<div class="fmpdownlistitem" index="'+i+'"  tId="'+node[i]["tId"]+'"><div class="fmpdownlisticon"><img src="'+mosparent._RootPath+node[i]["icon"]+'" style="width:16px;height:16px;margin-top:4px;" /></div>';
                        }
                        fmdownlisthtml+=node[i]["name"]+node[i]["sysname"]+'</div>';
                    }else{
                        //if($($(this)[0].nextSibling)[0].innerText==nodename){
                        //    fmdownlisthtml+='<div class="fmpdownlistitem active" index="'+i+'" tId="'+node[i]["tId"]+'"><div class="fmpdownlisticon"><i class="fa fa-check"></i></div>';
                        //}else{
                            fmdownlisthtml+='<div class="fmpdownlistitem" index="'+i+'"  tId="'+node[i]["tId"]+'"><div class="fmpdownlisticon"><img src="'+mosparent._RootPath+node[i]["icon"]+'" style="width:16px;height:16px;margin-top:4px;" /></div>';
                        //}
                        fmdownlisthtml+=node[i]["name"]+node[i]["sysname"]+'</div>';
                    }
                } 
            }else{//是第一个弹出框按钮
                var node=[];
                node.push({"name":"桌面","id":"26","pid":"2","sysname":"","icon":"core/img/icon/zm.png"},{"name":"我的电脑","id":"2","pid":"0","sysname":"","icon":"core/img/icon/wdn.png"},{"name":"网络","id":"3","pid":"0","sysname":"","icon":"core/img/icon/wl.png"},{"name":"回收站","id":"4","pid":"0","sysname":"","icon":"core/img/icon/recycle.png"});
                for(var i=0;i<node.length;i++){
                    var nodename=node[i]["name"]+node[i]["sysname"];
                    var nodetid="";
                    node[i]["pid"]=="0"?nodetid=fmltreeObj.getNodeByParam("id",node[i]["id"],null)["tId"]:nodetid=fmltreeObj.getNodeByParam("id",node[i]["id"],fmltreeObj.getNodeByParam("id",node[i]["pid"], null))["tId"];
                    if($($(this)[0].nextSibling)[0].innerText==nodename){
                        fmdownlisthtml+='<div class="fmpdownlistitem active" index="'+i+'" tId="'+nodetid+'"><div class="fmpdownlisticon"><img src="'+mosparent._RootPath+node[i]["icon"]+'" style="width:16px;height:16px;margin-top:4px;" /></div>';
                    }else{
                        fmdownlisthtml+='<div class="fmpdownlistitem" index="'+i+'"  tId="'+nodetid+'"><div class="fmpdownlisticon"><img src="'+mosparent._RootPath+node[i]["icon"]+'" style="width:16px;height:16px;margin-top:4px;" /></div>';
                    }
                    fmdownlisthtml+=node[i]["name"]+node[i]["sysname"]+'</div>';
                    if(i==0){
                        fmdownlisthtml+='<hr style="width:100%;float:left;margin:2px 0;">';
                    }
                }
            }
            $(".fmpdownlist").empty().append(fmdownlisthtml);
            var topAbsolute=mosparent.getAbsolute($(".base")[0],$(".fmtop")[0]);//元素位置
            var leftAbsolute=mosparent.getAbsolute($(".base")[0],$(this)[0]);//元素位置
            $(".fmpdownlist")[0].style.top=parseInt(topAbsolute.top+30)+"px";
            $(".fmpdownlist")[0].style.left=parseInt(leftAbsolute.left-30)+"px";
            if(fmdownlisthtml==''){
                $(".fmpdownlist").hide();
            }else{
                $(".fmdownlist").hide();
                $(".fmpdownlist").show();
            }
            $(".fmpdownlistitem").click(function(){
                var curnode=fmltreeObj.getNodeByTId($(this).attr("tId"));
                showfilelist(fmrtreesetting,curnode["children"]);
                $(".fmpathfrm").show();
                var node = curnode.getPath();//获取 node 节点的所有父节点（包括自己）。
                var fmpathfrmhtml='';
                for(var i=0;i<node.length;i++){
                    if(i==0){
                        fmpathfrmhtml+='<div class="fmfrmbtn" style="background: url('+mosparent._RootPath+node[node.length-1]["icon"]+') center center no-repeat;background-size:16px 16px;"></div>';
                        fmpathfrmhtml+='<div class="fmfrmbtnexp"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';
                        fmpathfrmhtml+='<div class="fmfrmbtntext" tId="'+node[i]["tId"]+'">'+node[i]["name"]+node[i]["sysname"]+'</div>';
                        if("children" in node[i]){
                            if(node[i]["children"].length>0){fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+node[i]["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';}
                        }
                        parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.icon").attr("src",mosparent._RootPath+node[node.length-1]["icon"]);
                        parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.newfolder").attr("src",mosparent._RootPath+"core/img/icon/wjj.png");
                        parent.$("#mlayer"+ifrmindex+">.mlayer-title>.mtitle")[0].innerHTML=node[node.length-1]["name"]+node[node.length-1]["sysname"];
                    }else{
                        if(i>1){
                            fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+node[i-1]["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';
                        }
                        fmpathfrmhtml+='<div class="fmfrmbtntext" tId="'+node[i]["tId"]+'">'+node[i]["name"]+node[i]["sysname"]+'</div>';
                        if(i==node.length-1){
                            if("children" in node[i]){
                                if(node[i]["children"].length>0){fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+node[i]["tId"]+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';}
                            }
                        }
                    }
                }
                $(".fmpathfrm").empty().append(fmpathfrmhtml);
                exptxtclick();
                backprevup($(this).attr("tId"),viewrecord);
                $(".fmbottom>.totalitem")[0].innerText=curnode.children.length;
                fmltreeObj.cancelSelectedNode();//先取消所有的选中状态
                fmltreeObj.selectNode(curnode,true);//将指定ID的节点选中
                //将叶节点隐藏
                for(var p in curnode["children"]){
                    if(curnode["children"][p]["size"]!==undefined && curnode["children"][p]["size"]!==""){
                        fmltreeObj.hideNode(curnode["children"][p]);
                    }
                }
                if(curnode.level>0){
                    fmltreeObj.expandNode(curnode,false,false,false);//将指定ID节点展开
                }
            });
            return false;//取消隐藏冒泡
        });
        $(".fmfrmbtntext").off("click").click(function(){
            var node = fmltreeObj.getNodeByTId($(this).attr("tId"));
            showfilelistbynode($(this),node);
            backprevup(node["tId"],viewrecord);
        });
    };
    function showfilelistbynode(dom,node){
        if(node["children"].length>0){
            $(dom[0].nextSibling).nextAll().remove();
        }
        parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.icon").attr("src",mosparent._RootPath+node["icon"]);
        node["level"]==0?parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.newfolder").attr("src",mosparent._RootPath+"core/img/icon/newfolder-s.png"):parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.newfolder").attr("src",mosparent._RootPath+"core/img/icon/wjj.png");
        if(node["tId"]=="fmltree_1"){
            parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.icon").attr("src",mosparent._RootPath+"core/img/icon/wjglq.png");
            parent.$("#mlayer"+ifrmindex+">.mlayer-title>.mtitle")[0].innerHTML="文件资源管理器";
        }else{
            parent.$("#mlayer"+ifrmindex+">.mlayer-title>.mtitle")[0].innerHTML=node["name"]+node["sysname"];
        } 
        $(".fmfrmbtn")[0].style.backgroundImage="url("+mosparent._RootPath+node["icon"]+")";
        for(var p in node["children"]){
            node["children"][p]["open"]=false;
            if(node["children"][p]["size"]!==""){
                node["children"][p]["isHidden"]=true;
            }
        }
        fmltreeObj.cancelSelectedNode();//先取消所有的选中状态
        fmltreeObj.selectNode(node,true);//将指定ID的节点选中
        if(node.level>0){
            fmltreeObj.expandNode(node,true,false,false);//将指定ID节点展开
        }
        showfilelist(fmrtreesetting,node["children"]);//右边列表显示
        $(".fmbottom>.totalitem")[0].innerText=node.children.length;
    };
    function fmltreeDom(treeId, treeNode){
        var spaceWidth = 10;
        var switchObj = $("#" + treeNode.tId + "_switch"),icoObj = $("#" + treeNode.tId + "_ico");
		switchObj.remove();
        icoObj.before(switchObj);
        if (treeNode.level > 0) {
			var spaceStr = '<span style="display: inline-block;width:' + (spaceWidth * treeNode.level)+ 'px"></span>';
			switchObj.before(spaceStr);
		}
    };
    function fmrtreeDom(treeId, treeNode){
        var switchObj = $("#" + treeNode.tId + "_switch");
		switchObj.remove();
    };
    function fmrtreeOnClick(event,treeId,treeNode) {
        $("#fmltree").removeClass("showIcon");
		$("#fmltree").hover(function () {
                if (!$("#fmltree").hasClass("showIcon")) {
                    $("#fmltree").addClass("showIcon");
                }
            }, function() {
                $("#fmltree").removeClass("showIcon");
        });
        //$(".ztree.mltree li a.curSelectedNode")[0].
    };
    function fmrtreeonDblClick(event, treeId, treeNode) {//右边列表双击
        if(treeNode["size"]!==undefined && treeNode["size"]!==""){
            //查找后缀,用相应程序打开
            if(treeNode["exe"]){
                eval(treeNode["exefunc"]);
            }else{
                switch(treeNode["extname"]){
                    case "php":
                        console.log(treeNode["filetype"]);
                    break;
                    case "ico":
                        console.log(treeNode["filetype"]);
                    break;
                }
            }
        }else{
            var fmpathfrmhtml='';//$(".fmpathfrm")[0].innerHTML;
            var lasttId=$(".fmfrmbtntext:last").attr("tId");
            var newtId=lasttId.substr(0,lasttId.indexOf("_"))+"_"+Number(parseInt(lasttId.replace(/[^0-9]/ig,""))+parseInt(treeNode["tId"].replace(/[^0-9]/ig,"")));
            var childrenhasfolder=false;
            fmpathfrmhtml+='<div class="fmfrmbtntext" tId="'+newtId+'">'+treeNode["name"]+treeNode["sysname"]+'</div>';
            parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.icon").attr("src",mosparent._RootPath+treeNode["icon"]);
            parent.$("#mlayer"+ifrmindex+">.mlayer-title>img.newfolder").attr("src",mosparent._RootPath+"core/img/icon/wjj.png");
            parent.$("#mlayer"+ifrmindex+">.mlayer-title>.mtitle")[0].innerHTML=treeNode["name"]+treeNode["sysname"];
            for(var p in treeNode["children"]){
                if(treeNode["children"][p]["size"]!==undefined && treeNode["children"][p]["size"]!==""){
                    treeNode["children"][p]["isHidden"]=false;
                }else{
                    childrenhasfolder=true;
                }
            }
            if(childrenhasfolder){
                fmpathfrmhtml+='<div class="fmfrmbtnexp" tId="'+newtId+'"><i class="iconfont icon-right" style="font-size:12px;text-align:center;display:block;"></i></div>';
            }
            $(".fmpathfrm").append(fmpathfrmhtml);
            $(".fmfrmbtn")[0].style.backgroundImage="url("+mosparent._RootPath+treeNode["icon"]+")";
            showfilelist(fmrtreesetting,treeNode["children"]);
            $(".fmbottom>.totalitem")[0].innerText=treeNode.children.length;
            exptxtclick();
            backprevup(newtId,viewrecord);
        }
    };
    function showfilelist(setting,data,showattr){//右边树显示
        for(var p in data){
            data[p]["open"]=false;
            if(data[p]["size"]!==""){
                data[p]["isHidden"]=false;
            }
        }
        //初始化树
        var fmrtreeObj=$.fn.zTree.init($("#fmrtree"), setting, data);
        
    };

</script>
</html>
