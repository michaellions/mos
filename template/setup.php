<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="../core/js/jquery-3.3.1.js"></script>
    <link href="../core/css/default.css" rel="stylesheet">
    <link href="../core/css/classic.css" type="text/css" rel="stylesheet" id="skin">
</head>
<body>
</body>
<script>
    document.oncontextmenu=new Function("event.returnValue=false;");//屏蔽右键
    //document.onselectstart=new Function("event.returnValue=false;");//屏蔽选择内容
    var mosparent=parent.mos; //获取父级mos对象的句柄
    $(document).on('click',function(e){
        mosparent.menuClose();//关闭开始菜单
        mosparent.commandCenterClose();//关闭消息中心
    });
    var username=mosparent._username;//获取当前用户名
    var slidesetTimer=null;//幻灯片设置的定时器
    var userDataSet=mosparent._userDataSet;//当前用户数据库
    //mosparent._userdesktopDataSet当前用户桌面信息数据库
    var ifrmindex = parent.layer.index; //先得到当前iframe层的索引
    var ifrmid="mlayer-iframe"+ifrmindex;//当前iframe的ID值
    $("#skin")[0].href=mosparent._RootPath+"core/css/"+mosparent._usersetupDataSet["personal"]["items"][1]["item"]["colorattribute"][Number(mosparent._usersetupDataSet["personal"]["items"][1]["item"]["colorindex"])]["name"]+".css";
    //mosparent._usersetupDataSet当前用户的设置
    /* 主页面 */
    var overviewhtml="";
    overviewhtml+='<div class="title" style="text-align:center;font-size:20px;margin-top:10px;line-height:38px;height:40px;font-family:\'Microsoft Yahei\';">';
        overviewhtml+='<span title="MOS 设置">MOS 设置</span>';
    overviewhtml+='</div>';
    overviewhtml+='<div style="height:60px;display:flex;justify-content:center;align-items:center;">';
        overviewhtml+='<div style="width:50%;display:flex;justify-content:center;align-items:center;margin-bottom:20px;">';
            overviewhtml+='<input style="width:100%;height:24px;" name="serch" placeholder="查找设置"><img src="">';
        overviewhtml+='</div>';
    overviewhtml+='</div>';
    overviewhtml+='<div class="setupsort">';
        overviewhtml+='<div id="sortlist" class="sortlist">';
    for(var key in mosparent._usersetupDataSet){//从json数据表jsonobject={"key1":value1,"key2":value2}中的key值依次读取
            overviewhtml+='<div id="'+key+'" class="sortlistcell">';
                overviewhtml+='<img class="sortlistcellimg" src="'+mosparent._RootPath+mosparent._usersetupDataSet[key]["img"]+'"/>';
                overviewhtml+='<div class="sortlistcelltitle">'+mosparent._usersetupDataSet[key]["title"]+'</div>';
                overviewhtml+='<div class="sortlistcelldesc">'+mosparent._usersetupDataSet[key]["desc"]+'</div>';
            overviewhtml+='</div>';
    }
        overviewhtml+='</div>';
    overviewhtml+='</div>';
    /* 基本框架 */
    var basehtml='';
    basehtml+='<div class="setbase">';
        basehtml+='<div class="setleft">';
            basehtml+='<div class="hlist">';
                basehtml+='<div id="home" class="hitem"><div style="width:220px;height:40px;text-align:left;"><i class="mosicon"><i class="mosicon mosicon-home"></i></i>  主页</div></div>';
            basehtml+='</div>';
            //basehtml+='<div style="float:left;height:40px;display:flex;justify-content:center;align-items:center;">';
            basehtml+='<div style="float:left;padding: 5px 10px;">';
                basehtml+='<input style="width:220px;height:24px;" name="subserch" placeholder="查找设置"><img src="">';
            basehtml+='</div>';
            //basehtml+='</div>';
            basehtml+='<span id="setupname" style="float:left;width:210px;height:24px;font-size:14px;padding:3px 10px;text-align:left;color:grey">MOS 设置</span>';
            basehtml+='<div id="setlist" class="list">';
            basehtml+='</div>';
        basehtml+='</div>';
        basehtml+='<div class="setrightbg">';
            basehtml+='<div class="setrighttop">';
            basehtml+='</div>';
            basehtml+='<div class="setright">';
            basehtml+='</div>';
        basehtml+='</div>';
    basehtml+='</div>';
    $("body").empty().append(overviewhtml);
    $("input[name=serch]").focus();
    var listid=parent.$("#mlayer"+ifrmindex).attr("listid");
    var cellid=parent.$("#mlayer"+ifrmindex).attr("cellid");
    setlistshow(listid,cellid);
    //setlistshow("personal","background");
    /*指定某列表为活动列表*/
    /*listid-项目列表的id
    /*cellid-活动列表的id
    ******************* */ 
    function setlistshow(listid,cellid){
        if(Number(parent.$("#mlayer"+ifrmindex).attr("showtime"))>0){
            listid="";
        }
        var id="";
        if(listid==""){
            $(".sortlistcell").click(function(){
                id=$(this).attr("id");
                $("body").empty().append(basehtml);
                $("input[name=subserch]").focus();
                $("#home").click(function(){
                    location.reload();
                });
                showlistitem(id,"");
            });
        }
        if(listid!==""){
            id=listid;
            $("body").empty().append(basehtml);
            $("input[name=subserch]").focus();
            $("#home").click(function(){
                $("body").empty().append(overviewhtml);
                $(".sortlistcell").click(function(){
                    id=$(this).attr("id");
                    $("body").empty().append(basehtml);
                    $("input[name=subserch]").focus();
                    $("#home").click(function(){
                        location.reload();
                    });
                    showlistitem(id,"");
                });
            });
            showlistitem(id,cellid);
        } 
    };
    function showlistitem(id,cellid){//显示列表子项
        parent.$("#mlayer"+ifrmindex).attr("showtime",Number(parent.$("#mlayer"+ifrmindex).attr("showtime"))+1);
        $("#setupname").html(mosparent._usersetupDataSet[id]["title"]);
        var items=mosparent._usersetupDataSet[id]["items"];
        var dhtml='';
        if(items.length>0){
            for(var i=0;i<items.length;i++){
                dhtml+='<div id="'+items[i]["id"]+'" class="listitem" index="'+i+'"><div class="listactprex hidden"></div><div style="width:220px;height:40px;text-align:left;"><i class="mosicon"><i class="mosicon mosicon-'+items[i]["id"]+'"></i></i>  '+items[i]["title"]+'</div></div>';
            }
            $("#setlist").empty().append(dhtml);
            $(".listitem").removeClass("listactive");
            $(".listactprex").addClass("hidden");
            //↓↓↓↓↓设置每个项目的首个活动列表-可修改id值即可修改为任意活动列表↓↓↓↓↓
            if(cellid!==""){
                $("#"+cellid).addClass("listactive");
                $("#"+cellid+" .listactprex").removeClass("hidden");
                var listindex=$("#"+cellid).attr("index");
                $(".setright").empty().append(items[listindex]["html"]);
                //首个活动列表初始设置
                if($("#background").length>0 && $("#background").hasClass("listactive")){//背景设置
                    bgset(items[listindex]);
                }

            //↑↑↑↑↑设置每个项目的首个活动列表-可修改id值即可修改为任意活动列表↑↑↑↑↑
            }else{
                //↓↓↓↓↓设置每个项目的首个活动列表-可修改id值即可修改为任意活动列表↓↓↓↓↓
                if($("#monitor").length>0){//显示设置
                    $("#monitor").addClass("listactive");
                    $("#monitor .listactprex").removeClass("hidden");
                    var listindex=$("#monitor").attr("index");
                    $(".setright").empty().append(items[listindex]["html"]);
                    
                }
                if($("#background").length>0){//背景设置
                    $("#background").addClass("listactive");
                    $("#background .listactprex").removeClass("hidden");
                    var listindex=$("#background").attr("index");
                    $(".setright").empty().append(items[listindex]["html"]);
                    bgset(items[listindex]);
                }
                //↑↑↑↑↑设置每个项目的首个活动列表-可修改id值即可修改为任意活动列表↑↑↑↑↑
            }
            $("#setlist .listitem").click(function(){//列表点击时
                var itemid=$(this).attr("id");
                var itemindex=Number($(this).attr("index"));
                var item=items[itemindex];//当前设置类中的列表项数据
                $(".listitem").removeClass("listactive");
                $(".listactprex").addClass("hidden");
                $("#"+itemid).addClass("listactive");
                $("#"+itemid+" .listactprex").removeClass("hidden");
                //对活动列表进行相应的设置及功能js
                /*个性化设置*/
                if($("#background").length>0 && $("#background").hasClass("listactive")){//背景设置
                    $(".setright").empty().append(item["html"]);
                    bgset(item);
                }
                if($("#color").length>0 && $("#color").hasClass("listactive")){//颜色设置
                    $(".setright").empty().append(item["html"]);
                    colorset(item);
                    
                }
                if($("#lockscreen").length>0 && $("#lockscreen").hasClass("listactive")){//锁定屏幕设置
                    $(".setright").empty().append(item["html"]);
                    lockscreen(item);
                    
                }
                if($("#theme").length>0 && $("#theme").hasClass("listactive")){//主题设置
                    $(".setright").empty().append(item["html"]);
                    theme(item);
                    
                }
                if($("#start").length>0 && $("#start").hasClass("listactive")){//开始设置
                    $(".setright").empty().append(item["html"]);
                    start(item);
                    
                }
                if($("#taskbar").length>0 && $("#taskbar").hasClass("listactive")){//任务栏设置
                    if(mosparent._userdesktopDataSet["groupright"].length>9){ 
                        var addhtml='';
                        for(var i=9;i<mosparent._userdesktopDataSet["groupright"].length;i++){
                            var id=mosparent._userdesktopDataSet["groupright"][i]["id"].replace(/mos-/, "");
                            addhtml+='<div class="moslow" style="text-align:left;margin-top:5px;"><div class="start-item-icon" style="width:34px;height:34px;float:left;"><i class="icon-30"><i class="icon-30 icon-30-'+id+'"></i></i></div><span id="'+id+'title" style="float: left;font-size:14px;line-height:32px;margin-left:10px;width:60px;">'+mosparent._userdesktopDataSet["groupright"][i]["tipscontent"]+'</span><div style="float:left;text-align:left;margin-top:4px;margin-left:100px;"><label><input id="'+id+'" class="mos-switch mos-switch-animbg" type="checkbox"><span id="'+id+'text" class="text" >关</span></label></div></div>';
                        }
                        $(".setright").empty().append(item["html"]);
                        $(".appiconhtml").empty().append(addhtml);
                    }else{
                        $(".setright").empty().append(item["html"]);
                    } 
                    taskbar(item);
                    
                }
                /*个性化设置*/
                /*系统设置*/
                
                /*系统设置*/
            });
        }
    };
    function bgset(item){//背景设置
        $("#bgmodel").val(mosparent._userdesktopDataSet["wallpapers"]["bgmodel"]);
        $(".setrighttop").empty().append("<span class=\"setrtitle\">"+item["title"]+"</span>");
        bgselectmodel($("#bgmodel").val());
        $("#bgmodel").change(function(){
            mosparent._userdesktopDataSet["wallpapers"]["bgmodel"]=$("#bgmodel").val();
            bgselectmodel($("#bgmodel").val());
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存    
        });
        $("#picmodel").change(function(){
            mosparent._userdesktopDataSet["wallpapers"]["picmodel"]=$("#picmodel").val();
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存
        });
    };
    function bgselectmodel(modelval){//背景模式选择
        switch(modelval){
            case "pic":
                $("#bgpreview").empty()
                $("#"+mosparent._dynamicwallpaperid).remove();
                parent.$("#mos-desktop-scene").empty();
                clearInterval(slidesetTimer);//清除幻灯定时器
                slidesetTimer=null;
                var imgurl=mosparent._RootPath+mosparent._userdesktopDataSet["wallpapers"]["wallpaper"]["pc"];
                $(".setbg").removeClass("setshow").addClass("sethidden");
                $("#setbgpic").removeClass("sethidden").addClass("setshow");
                $("#bgpreview").css({"background-image":'url('+imgurl+')',"background-size":"400px 250px","background-repeat":mosparent._userdesktopDataSet["wallpapers"]["picmodel"],"background-color":""});
                mosparent.setBg();//立即改变桌面背景
                if(mosparent._userdesktopDataSet["wallpapers"]["picurl"].length>0){//获取背景图片
                    var picpath="";
                    for(var i=0;i<mosparent._userdesktopDataSet["wallpapers"]["picurl"].length;i++){
                        picpath='../../'+mosparent._userdesktopDataSet["wallpapers"]["picurl"][i];
                        var picurl=mosparent._RootPath+mosparent._userdesktopDataSet["wallpapers"]["picurl"][i];
                        $.post(mosparent._RootPath+"core/func/interactive.php",{"bgfilepath":picpath},function(data){
                            var filenamelist=$.parseJSON(data);
                            if(filenamelist.length>0){
                                var picboxhtml="";
                                for(var j=0;j<filenamelist.length;j++){
                                    picboxhtml+='<div index="'+j+'" title="'+filenamelist[j]+'" class="picselectbox" picurl="'+picurl+'/" ';
                                    picboxhtml+='style="background-image:url('+picurl+'/'+filenamelist[j]+');background-repeat:no-repeat;background-size:100% 100%;"></div>';
                                }
                                $("#picselect").empty().append(picboxhtml);
                                $("#picselect .picselectbox").click(function(){
                                    var curpicurl=$(this)[0].style.backgroundImage.replace(/url\("/g,'').replace(/"\)/g,'');//图片选择器的路径是绝对路径http://localhost/mos/core/img/wallpapers/5.jpg
                                    var bgpicurl=curpicurl.replace(new RegExp(mosparent._RootPath,"g"),'');//背景路径是相对于根路径
                                    $("#bgpreview").css({"background-image":'url('+curpicurl+')'});
                                    mosparent._userdesktopDataSet["wallpapers"]["wallpaper"]["pc"]=bgpicurl;
                                    mosparent._userdesktopDataSet["wallpapers"]["wallpaper"]["mobile"]=bgpicurl;
                                    mosparent.setBg();//立即改变桌面背景
                                    mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存 
                                });
                            }
                        });   
                    }
                }
                $("#btn-viewpic").click(function(){//浏览按钮点击
                    //parent.layer.alert('只想简单的提示');
                });
                
            break;
            case "pcolor":
                $("#bgpreview").empty()
                $("#"+mosparent._dynamicwallpaperid).remove();
                parent.$("#mos-desktop-scene").empty();
                clearInterval(slidesetTimer);//清除幻灯定时器
                slidesetTimer=null;
                $(".setbg").removeClass("setshow").addClass("sethidden");
                $("#setbgcolor").removeClass("sethidden").addClass("setshow");
                $("#bgpreview").css({"background-color":mosparent._userdesktopDataSet["wallpapers"]["colorpool"][Number(mosparent._userdesktopDataSet["wallpapers"]["colorindex"])],"background-image":"url()"});
                mosparent.setBg();//立即改变桌面背景
                var pcolorhtml='';
                for(var i=0;i<mosparent._userdesktopDataSet["wallpapers"]["colorpool"].length;i++){
                    pcolorhtml+='<div class="colorselectbox" index="'+i+'" style="background-color:'+mosparent._userdesktopDataSet["wallpapers"]["colorpool"][i]+';"><label id="pcolorpick'+i+'" style="left:26px;top:-2px;" class="colorpick sethidden"><input type="checkbox" checked disabled/><div style="background:black;border:1px solid #000000;" class="show-box" /></label></div>';                    
                }
                $(".colorselect").empty().append(pcolorhtml);
                $(".colorpick").removeClass("sethidden").addClass("sethidden");
                $("#pcolorpick"+mosparent._userdesktopDataSet["wallpapers"]["colorindex"]).removeClass("sethidden").addClass("setshow");
                $(".colorselectbox").click(function(){
                    $(".colorpick").removeClass("sethidden").addClass("sethidden");
                    $("#pcolorpick"+$(this).attr("index")).removeClass("sethidden").addClass("setshow");
                    $("#bgpreview").css("background-color",$(this).css("background-color"));
                    mosparent._userdesktopDataSet["wallpapers"]["colorindex"]=$(this).attr("index");
                    mosparent.setBg();//立即改变桌面背景
                    mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存
                });
            break;
            case "slide":
                $("#bgpreview").empty()
                $("#"+mosparent._dynamicwallpaperid).remove();
                parent.$("#mos-desktop-scene").empty();
                $(".setbg").removeClass("setshow").addClass("sethidden");
                $("#setbgslide").removeClass("sethidden").addClass("setshow");
                $("#slideint").val(mosparent._userdesktopDataSet["wallpapers"]["autotime"]);              
                var curbgpic=parent.$("#mos").css("background-image").replace(/url\("/g,'').replace(/"\)/g,'');
                $("#bgpreview").css({"background-image":"url("+curbgpic+")","background-size":"400px 250px","background-repeat":mosparent._userdesktopDataSet["wallpapers"]["picmodel"]});
                $("#smslide").css({"background-image":"url("+curbgpic+")","background-size":"75px 30px","background-repeat":mosparent._userdesktopDataSet["wallpapers"]["picmodel"]});
                slidesetTimer=setInterval(function(){//定时执行
                    curbgpic=parent.$("#mos").css("background-image").replace(/url\("/g,'').replace(/"\)/g,'');
                    $("#bgpreview").css("background-image","url("+curbgpic+")");
                    $("#smslide").css("background-image","url("+curbgpic+")");
                },100);
                $("#slideint").change(function(){//幻灯变化频率
                    mosparent._userdesktopDataSet["wallpapers"]["autotime"]=$("#slideint").val();
                    mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存
                    mosparent.setBg();//立即改变桌面背景
                });
                $("#btn-viewslide").click(function(){//浏览按钮点击
                    
                    mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存
                    mosparent.setBg();//立即改变桌面背景
                });
                mosparent.setBg();//立即改变桌面背景
            break;
            case "dynamic":
                $(".setbg").removeClass("setshow").addClass("sethidden");
                $("#setdynamic").removeClass("sethidden").addClass("setshow");
                $("#bgpreview").css({"background-image":'url('+mosparent._RootPath+mosparent._userdesktopDataSet["wallpapers"]["dynamic"]["dynamicpool"][Number(mosparent._userdesktopDataSet["wallpapers"]["dynamic"]["index"])]["picurl"]+')',"background-size":"400px 250px","background-repeat":"no-repeat","background-color":""});
                /*var bghtml='<div class=\"pwtaskbar\"></div><div class=\"pwstartmenu\"><div class=\"pwitem\" style=\"top:10px;left:4px;\"></div><div class=\"pwitemtext\" style=\"top:2px;left:22px;\"></div><div class=\"pwitem\" style=\"top:10px;left:4px;\"></div><div class=\"pwitemtext\" style=\"top:2px;left:22px;\"></div><div class=\"pwitem\" style=\"top:10px;left:4px;\"></div><div class=\"pwitemtext\" style=\"top:2px;left:22px;\"></div><div class=\"pwitem\" style=\"top:10px;left:4px;\"></div><div class=\"pwitemtext\" style=\"top:2px;left:22px;width:15px;\"></div><div class=\"pwitem\" style=\"top:10px;left:4px;\"></div><div class=\"pwitemtext\" style=\"top:2px;left:22px;\"></div><div class=\"pwitem\" style=\"top:10px;left:4px;\"></div><div class=\"pwitemtext\" style=\"top:2px;left:22px;width:20px;\"></div><div class=\"pwitem\" style=\"top:10px;left:4px;\"></div><div class=\"pwitemtext\" style=\"top:2px;left:22px;\"></div><div class=\"pwitem\" style=\"top:10px;left:4px;\"></div><div class=\"pwitemtext\" style=\"top:2px;left:22px;\"></div></div><div class=\"pwopenlayer\"><div class=\"pwtitle\"><div class=\"pwtitletext\"></div></div></div>';
                $("#bgpreview").empty().append(bghtml);*/
                var picboxhtml="";
                for(var i=0;i<mosparent._userdesktopDataSet["wallpapers"]["dynamic"]["dynamicpool"].length;i++){
                    picboxhtml+='<div index="'+i+'" title="'+mosparent._userdesktopDataSet["wallpapers"]["dynamic"]["dynamicpool"][i]["desc"]+'" class="dynamicselectbox" style="background-image:url('+mosparent._RootPath+mosparent._userdesktopDataSet["wallpapers"]["dynamic"]["dynamicpool"][i]["picurl"]+');background-repeat:no-repeat;background-size:100% 100%;"><label id="dynamicpick'+i+'" index="'+i+'" style="left:100px;top:0px;" class="colorpick sethidden"><input type="checkbox" checked disabled/><div style="background:black;border:1px solid #000000;" class="show-box" /></label></div>';
                }
                $("#dynamicselect").empty().append(picboxhtml);
                if(mosparent._userdesktopDataSet["wallpapers"]["dynamic"]["dynamicpool"][Number(mosparent._userdesktopDataSet["wallpapers"]["dynamic"]["index"])]["html"]==""){
                    $("#dynamicset")[0].innerText="当前壁纸无设置项";
                }
                $(".colorpick").removeClass("sethidden").addClass("sethidden");
                $("#dynamicpick"+mosparent._userdesktopDataSet["wallpapers"]["dynamic"]["index"]).removeClass("sethidden").addClass("setshow");
                $("#dynamicselect .dynamicselectbox").click(function(){
                    $("#"+mosparent._dynamicwallpaperid).remove();
                    parent.$("#mos-desktop-scene").empty();
                    $("#bgpreview").css({"background-image":"url()"});
                    $("#bgpreview").css({"background-image":'url('+mosparent._RootPath+mosparent._userdesktopDataSet["wallpapers"]["dynamic"]["dynamicpool"][Number($(this).attr("index"))]["picurl"]+')',"background-size":"400px 250px","background-repeat":"no-repeat","background-color":""});
                    $(".colorpick").removeClass("sethidden").addClass("sethidden");
                    $("#dynamicpick"+$(this).attr("index")).removeClass("sethidden").addClass("setshow");
                    mosparent._userdesktopDataSet["wallpapers"]["dynamic"]["index"]=$(this).attr('index');
                    dynamicfile=mosparent._RootPath+"core/js/"+mosparent._userdesktopDataSet["wallpapers"]["dynamic"]["dynamicpool"][Number(mosparent._userdesktopDataSet["wallpapers"]["dynamic"]['index'])]["name"]+".js";
                    mosparent.loaddynamic(mosparent._dynamicwallpaperid,dynamicfile);
                    mosparent.setBg();//立即改变桌面背景
                    mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存
                });
            break;
        }
    };
    function colorset(item){//颜色设置
        var imgurl=mosparent._RootPath+mosparent._userdesktopDataSet["wallpapers"]["wallpaper"]["pc"];
        $(".setrighttop").empty().append("<span class=\"setrtitle\">"+item["title"]+"</span>");
        $("#colorpreview").css({"background-image":'url('+imgurl+')',"background-size":"400px 250px","background-repeat":mosparent._userdesktopDataSet["wallpapers"]["picmodel"],"background-color":""});
        var colorhtml='';
        for(var i=0;i<item["item"]["colorpool"].length;i++){
            colorhtml+='<div class="colorselectbox" index="'+i+'" style="background-color:'+item["item"]["colorpool"][i]+';" title="'+item["item"]["colorattribute"][i]["desc"]+'"><label id="colorpick'+i+'" index="'+i+'" style="left:26px;top:-2px;" class="colorpick sethidden"><input type="checkbox" checked disabled/><div style="background:black;border:1px solid #000000;" class="show-box" /></label></div>';                    
        }
        $(".colorselect").empty().append(colorhtml);
        $(".colorpick").removeClass("sethidden").addClass("sethidden");
        $("#colorpick"+item["item"]["colorindex"]).removeClass("sethidden").addClass("setshow");
        if(item["item"]["btmbartrans"]=="on"){
            $("#btmbartrans").attr("checked",true);
            if(item["item"]["btmbarcolor"]=="on"){
                parent.$("#mos_task_bar").removeClass().addClass("mostaskbar");
            }else{
                parent.$("#mos_task_bar").removeClass().addClass("mostaskbar-ncolor");
            }  
        }else{
            if(item["item"]["btmbarcolor"]=="on"){
                parent.$("#mos_task_bar").removeClass().addClass("mostaskbar-non");
            }else{
                parent.$("#mos_task_bar").removeClass().addClass("mostaskbar-ncolor");
            } 
            
        }
        if(item["item"]["btmbarcolor"]=="on"){
            $("#btmbarcolor").attr("checked",true);
            if(item["item"]["btmbartrans"]=="on"){
                parent.$("#mos_task_bar").removeClass().addClass("mostaskbar");
            }else{
                parent.$("#mos_task_bar").removeClass().addClass("mostaskbar-non");
            }
        }else{
            parent.$("#mos_task_bar").removeClass().addClass("mostaskbar-ncolor");
        }
        if(item["item"]["titlebarcolor"]=="on"){
            $("#titlebarcolor").attr("checked",true);
            parent.$(".mos-open-iframe .mlayer-title.active").css('background-color',item["item"]["colorattribute"][Number(item["item"]["colorindex"])]["css"][6]["attribute"][0]["background-color"]);
            parent.$(".mlayer-border.active").css('border',item["item"]["colorattribute"][Number(item["item"]["colorindex"])]["css"][5]["attribute"][0]["border"]);
        }
        $(".colorselectbox").click(function(){
            $(".colorpick").removeClass("sethidden").addClass("sethidden");
            $("#colorpick"+$(this).attr("index")).removeClass("sethidden").addClass("setshow");
            //$("#colorpreview").css("background-color",$(this).css("background-color"));
            item["item"]["colorindex"]=$(this).attr("index");
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存
            var cssDataSet=item["item"]["colorattribute"][$(this).attr("index")]["css"];
            //生成css文本
            var csstext="";
            for(var i=0;i<cssDataSet.length;i++){
                csstext+=cssDataSet[i]["element"]+" {/*"+cssDataSet[i]["desc"]+"*/";
                for(var j=0;j<cssDataSet[i]["attribute"].length;j++){
                    for(var key in cssDataSet[i]["attribute"][j]){
                        csstext+=key+":"+cssDataSet[i]["attribute"][j][key]+";";
                    }
                }
                csstext+="}";  
            }
            //保存为相应的css文件
            mosparent.savecss("../core/css/"+item["item"]["colorattribute"][$(this).attr("index")]["name"]+".css",csstext);
            //实时更新skin
            parent.$("#skin")[0].href=mosparent._RootPath+"core/css/"+item["item"]["colorattribute"][$(this).attr("index")]["name"]+".css";
            $("#skin")[0].href=mosparent._RootPath+"core/css/"+item["item"]["colorattribute"][$(this).attr("index")]["name"]+".css";
            if(item["item"]["titlebarcolor"]=="on"){
                parent.$(".mos-open-iframe .mlayer-title.active").css('background-color',cssDataSet[6]["attribute"][0]["background-color"]);
                parent.$(".mlayer-border.active").css('border',cssDataSet[5]["attribute"][0]["border"]);  
            }
            if(item["item"]["btmbartrans"]=="on"){
                $("#btmbartrans").attr("checked",true);
                if(item["item"]["btmbarcolor"]=="on"){
                    parent.$("#mos_task_bar").removeClass().addClass("mostaskbar");
                }else{
                    parent.$("#mos_task_bar").removeClass().addClass("mostaskbar-ncolor");
                }  
            }else{
                if(item["item"]["btmbarcolor"]=="on"){
                    parent.$("#mos_task_bar").removeClass().addClass("mostaskbar-non");
                }else{
                    parent.$("#mos_task_bar").removeClass().addClass("mostaskbar-ncolor");
                }  
            }
            if(item["item"]["btmbarcolor"]=="on"){
                $("#btmbarcolor").attr("checked",true);
                if(item["item"]["btmbartrans"]=="on"){
                    parent.$("#mos_task_bar").removeClass().addClass("mostaskbar");
                }else{
                    parent.$("#mos_task_bar").removeClass().addClass("mostaskbar-non");
                }
            }else{
                parent.$("#mos_task_bar").removeClass().addClass("mostaskbar-ncolor");
            }
        });
        $(".mos-switch").click(function (){
            var chkid=$(this).attr("id");
            if($("#"+chkid)[0]["checked"]){
                $("#"+chkid+"text")[0]["innerText"]="开";
                switch (chkid){
                    case "btmbartrans":
                        item["item"]["btmbartrans"]="on";
                        if(item["item"]["btmbarcolor"]=="on"){
                            parent.$("#mos_task_bar").removeClass().addClass("mostaskbar");
                        }else{
                            parent.$("#mos_task_bar").removeClass().addClass("mostaskbar-ncolor");
                        } 
                    break;
                    case "btmbarcolor":
                        item["item"]["btmbarcolor"]="on";
                        if(item["item"]["btmbartrans"]=="on"){
                            parent.$("#mos_task_bar").removeClass().addClass("mostaskbar");
                        }else{
                            parent.$("#mos_task_bar").removeClass().addClass("mostaskbar-non");
                        }
                    break;
                    case "titlebarcolor":
                        parent.$(".mos-open-iframe .mlayer-title.active").css('background-color',item["item"]["colorattribute"][Number(item["item"]["colorindex"])]["css"][6]["attribute"][0]["background-color"]);
                        parent.$(".mlayer-border.active").css('border',item["item"]["colorattribute"][Number(item["item"]["colorindex"])]["css"][5]["attribute"][0]["border"]); 
                        item["item"]["titlebarcolor"]="on";
                    break;
                }         
            }else{
                $("#"+chkid+"text")[0]["innerText"]="关"; 
                switch (chkid){
                    case "btmbartrans":
                        item["item"]["btmbartrans"]="off"; 
                        if(item["item"]["btmbarcolor"]=="on"){
                            parent.$("#mos_task_bar").removeClass().addClass("mostaskbar-non");
                        }else{
                            parent.$("#mos_task_bar").removeClass().addClass("mostaskbar-ncolor");
                        }                    
                    break;
                    case "btmbarcolor":
                        item["item"]["btmbarcolor"]="off";
                        parent.$("#mos_task_bar").removeClass().addClass("mostaskbar-ncolor");
                    break;
                    case "titlebarcolor":
                        parent.$(".mos-open-iframe .mlayer-title.active").css('background-color','#000');
                        parent.$(".mlayer-border.active").css('border','1px solid #000');
                        item["item"]["titlebarcolor"]="off";
                    break;
                }  
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存
        });
    }
    function lockscreen(item){//锁屏界面设置
        var lockitem=item["item"];
        var lockmodelselecthtml='';
        $(".setrighttop").empty().append("<span class=\"setrtitle\">"+item["title"]+"</span>");
        for(key in lockitem["models"]){
            lockmodelselecthtml+='<option value="'+key+'">'+lockitem["models"][key]+'</option>';
        }
        $("#lockmodel").empty().append(lockmodelselecthtml);
        $("#lockmodel").val(lockitem["lockmodel"]);
        lockselectmodel(lockitem,$("#lockmodel").val());
        $("#lockmodel").change(function(){
            lockitem["lockmodel"]=$("#lockmodel").val();
            lockselectmodel(lockitem,$("#lockmodel").val());
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存  
        });
        $("#locktimeint").val(lockitem["locktime"]);
        $("#locktimeint").change(function(){
            lockitem["locktime"]=$("#locktimeint").val();
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存
        });
        if(lockitem["lock"]=="true"){
            $("#lock").attr("checked",true);
            $("#locktext")[0]["innerText"]="开";
        }
        $("#lock").click(function (){
            if($("#lock")[0]["checked"]){
                $("#locktext")[0]["innerText"]="开";
                lockitem["lock"]="true";
            }else{
                $("#locktext")[0]["innerText"]="关";
                lockitem["lock"]="false";
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存  
        });
        if(lockitem["unlock"]=="true"){
            $("#unlock").attr("checked",true);
            $("#unlocktext")[0]["innerText"]="开";
        }
        $("#unlock").click(function (){
            if($("#unlock")[0]["checked"]){
                $("#unlocktext")[0]["innerText"]="开";
                lockitem["unlock"]="true";
            }else{
                $("#unlocktext")[0]["innerText"]="关";
                lockitem["unlock"]="false";
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存  
        });
    };
    function lockselectmodel(lockitem,modelval){//锁屏模式选择
        switch(modelval){
            case "pic":
                var imgurl=mosparent._RootPath+lockitem["lockpic"];
                $(".setbg").removeClass("setshow").addClass("sethidden");
                $("#setlockpic").removeClass("sethidden").addClass("setshow");
                $("#lockpreview").css({"background-image":'url('+imgurl+')',"background-size":"400px 250px","background-repeat":"no-repeat","background-color":""});
                if(lockitem["picurl"].length>0){//获取背景图片
                    var picurl="";
                    for(var i=0;i<lockitem["picurl"].length;i++){
                        picurl='../../'+lockitem["picurl"][i];
                        var imgurl=mosparent._RootPath+lockitem["picurl"][i];
                        $.post(mosparent._RootPath+"core/func/interactive.php",{"bgfilepath":picurl},function(data){
                            var filenamelist=$.parseJSON(data);
                            if(filenamelist.length>0){
                                var picboxhtml="";
                                for(var j=0;j<filenamelist.length;j++){
                                    picboxhtml+='<div index="'+j+'" title="'+filenamelist[j]+'" class="picselectbox" picurl="'+imgurl+'/" ';
                                    picboxhtml+='style="background-image:url('+imgurl+'/'+filenamelist[j]+');background-repeat:no-repeat;background-size:100% 100%;"></div>';
                                }
                                $("#lockpicselect").empty().append(picboxhtml);
                                $(".picselectbox").click(function(){
                                    var curpicurl=$(this)[0].style.backgroundImage.replace(/url\("/g,'').replace(/"\)/g,'');//图片选择器的路径
                                    var lockpicurl=curpicurl.replace(new RegExp(mosparent._RootPath,"g"),'');//背景路径是相对于根路径
                                    $("#lockpreview").css({"background-image":'url('+curpicurl+')'});
                                    lockitem["lockpic"]=lockpicurl;
                                    mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存
                                });
                            }
                        });   
                    }
                }
                $("#btn-lockviewpic").click(function(){//浏览按钮点击
                    //parent.layer.alert('只想简单的提示');
                });
            break;
            case "slide":
                var imgurl=mosparent._RootPath+lockitem["lockpic"];
                $(".setbg").removeClass("setshow").addClass("sethidden");
                $("#setlockslide").removeClass("sethidden").addClass("setshow");
                $("#lockslideint").val(lockitem["autotime"]);
                $("#lockpreview").css({"background-image":'url('+imgurl+')',"background-size":"400px 250px","background-repeat":"no-repeat","background-color":""});              
                $("#locksmslide").css({"background-image":'url('+imgurl+')',"background-size":"75px 30px","background-repeat":"no-repeat","background-color":""});
                $("#lockslideint").change(function(){//幻灯变化频率
                    lockitem["autotime"]=$("#lockslideint").val();
                    mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存
                });
                $("#btn-lockviewslide").click(function(){//浏览按钮点击
                    
                });
            break;
            default://自定义的锁屏设置如-水族箱等
                $(".setbg").removeClass("setshow").addClass("sethidden");
                $("#lockcustom").removeClass("sethidden").addClass("setshow");
                $("#lockpreview").css({"background-image":'url('+mosparent._RootPath+lockitem["custompic"][modelval]+')',"background-size":"400px 250px","background-repeat":"no-repeat","background-color":""});
                $("#lockcustom").empty().append(lockitem["customhtml"][modelval]);
                eval("("+lockitem["customscript"][modelval]+")");
        }
    };
    function theme(item){//主题设置
        var themeitem=item["item"];
        var themeshortcutsshowhtml='';
        var themeshortcutslisthtml='';
        $(".setrighttop").empty().append("<span class=\"setrtitle\">"+item["title"]+"</span>");
        var themeselecthtml='';
        themeitem["themepool"].forEach(function(data,index){
            themeselecthtml+='<option value="'+data["value"]+'">'+data["themename"]+'</option>';
        });
        $("#themeselect").empty().append(themeselecthtml);
        $("#themeselect").val(themeitem["themename"]);
        $("#themeselect").change(function(){//幻灯变化频率
            themeitem["themename"]=$("#themeselect").val();
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存
            //根据主题变换相应css
            
        });
        themeshortcutsshowhtml+='<div class="title">桌面图标</div>';
        for(var i=0;i<mosparent._userdesktopDataSet["shortcuts"].length;i++){
            if(mosparent._userdesktopDataSet["shortcuts"][i]["stylename"]=="system"){
                themeshortcutsshowhtml+='<label class="mchkbox"><input name="shortcutchk" index="'+i+'" type="checkbox" ';
                themeshortcutsshowhtml+=mosparent._userdesktopDataSet["shortcuts"][i]["show"]=="true"?"checked":"";
                themeshortcutsshowhtml+=' /><div class="show1-box"></div><div class="boxtitle">'+mosparent._userdesktopDataSet["shortcuts"][i]["title"]+'</div></label>';
                themeshortcutslisthtml+='<div class="shortcut" index="'+i+'"><img class="icon" src="'+mosparent._RootPath+mosparent._userdesktopDataSet["shortcuts"][i]["img"]+'"/><div class="title">'+mosparent._userdesktopDataSet["shortcuts"][i]["title"]+'</div></div>';
            }
        }
        themeshortcutslisthtml+='<div class="shortcut" index="-1"><img class="icon" src="'+mosparent._RootPath+mosparent._userdesktopDataSet["others"]["recyclefull"]["img"]+'"/><div class="title">'+mosparent._userdesktopDataSet["others"]["recyclefull"]["title"]+'</div></div>';
        $(".themeshortcut").empty().append(themeshortcutsshowhtml);
        $(".themeshortcutlist").empty().append(themeshortcutslisthtml);
        $("input[name='shortcutchk']").click(function(){
            var thisindex=$(this).attr("index");
            mosparent._userdesktopDataSet["shortcuts"][Number(thisindex)]["show"]=""+$(this).prop("checked");
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存
            mosparent.setdesktop();
            mosparent.setdesktopshortcut();
            mosparent.renderShortcuts(mosparent._userdesktopDataSet["others"]);//渲染图标
        });
        $(".themeshortcutlist").click(function(){
            $(".themeshortcutlist .shortcut").removeClass("shortcut-focus"); 
        });
        $(".themeshortcutlist .shortcut").click(function(e){
            $(".themeshortcutlist .shortcut").removeClass("shortcut-focus");  
            $(this).addClass("shortcut-focus");
            e.stopPropagation();//阻止冒泡事件，即父元素.mshortcutslist的单击事件对.shortcut无效
        });
        $("#btn-themechangeicon").click(function(){//更改桌面图标
            for(var i=0;i<$(".themeshortcutlist .shortcut").length;i++){
                if($($(".themeshortcutlist .shortcut")[i]).hasClass("shortcut-focus")){
                    var shortcutindex=$($(".themeshortcutlist .shortcut")[i]).attr("index");
                    if(shortcutindex!=="-1"){
                        console.log(mosparent._RootPath+mosparent._userdesktopDataSet["shortcuts"][Number(shortcutindex)]["img"]);
                    }else{
                        console.log(mosparent._RootPath+mosparent._userdesktopDataSet["others"]["recyclefull"]["img"]);
                    }
                    //mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存
                    break;
                }
            }
            
        });
        $("#btn-themedefaulticon").click(function(){//还原默认图标
            for(var i=0;i<$(".themeshortcutlist .shortcut").length;i++){
                if($($(".themeshortcutlist .shortcut")[i]).hasClass("shortcut-focus")){
                    var shortcutindex=$($(".themeshortcutlist .shortcut")[i]).attr("index");
                    if(shortcutindex!=="-1"){
                        console.log(mosparent._RootPath+mosparent._userdesktopDataSet["shortcuts"][Number(shortcutindex)]["img"]);
                    }else{
                        console.log(mosparent._RootPath+mosparent._userdesktopDataSet["others"]["recyclefull"]["img"]);
                    }
                    //mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存
                    break;
                }
            }
        });
        var thememousehtml='';
        var themecursorlisthtml='';
        thememousehtml+='<div class="title">指针样式</div><select style="width:270px;margin:15px 0 10px 10px">';
        for(var i=0;i<themeitem["allsor"].length;i++){
            thememousehtml+='<option value=\"'+themeitem["allsor"][i]["name"]+'\">'+themeitem["allsor"][i]["desc"]+'</option>';
            if(themeitem["allsor"][i]["name"]==themeitem["cursor"]){
                if(themeitem["allsor"][i]["detail"].length>0){
                    for(var j=0;j<themeitem["allsor"][i]["detail"].length;j++){
                        themecursorlisthtml+='<div class="cursorlist moslow" pindex="'+i+'" index="'+j+'">';
                            themecursorlisthtml+='<span style="height:40px;font-size:14px;line-height:40px;margin-left:8px;float:left;">'+themeitem["allsor"][i]["detail"][j]["desc"]+'</span>';
                            themecursorlisthtml+='<span style="height:40px;width:40px;float:right;margin: 0 1px 0 0;cursor:'+themeitem["allsor"][i]["detail"][j]["attribute"]["cursor"]+'"></span>';
                        themecursorlisthtml+='</div>';
                    }
                }
            }
        }
        thememousehtml+='</select><button id="btn-themedelcursor" class="mbtn" style="float:right;margin:0 10px 0 0;width:90px;">删除</button><button id="btn-themesavecursor" class="mbtn" style="float:right;margin:0 5px 0 0;width:90px;">另存为</button>';
        $(".thememouse").empty().append(thememousehtml);
        $(".themecursorlist").empty().append(themecursorlisthtml);
        $(".themecursorlist .cursorlist").click(function(e){
            $(".themecursorlist .cursorlist").removeClass("cursorlist-focus");
            $(".thememouseprev")[0].style.cursor=themeitem["allsor"][Number($(this).attr("pindex"))]["detail"][Number($(this).attr("index"))]["attribute"]["cursor"];
            $(this).addClass("cursorlist-focus");
            e.stopPropagation();//阻止冒泡事件，即父元素.mshortcutslist的单击事件对.shortcut无效
        });
    };
    function start(item){//开始菜单栏设置
        var startitem=item["item"];
        $(".setrighttop").empty().append("<span class=\"setrtitle\">"+item["title"]+"</span>");
        //在"开始"菜单中显示应用列表
        if(startitem["showapplist"]=="on"){
            $("#showapplist").attr("checked",true);
            $("#showapplisttext")[0]["innerText"]="开";
        }
        $("#showapplist").click(function (){
            if($("#showapplist")[0]["checked"]){
                $("#showapplisttext")[0]["innerText"]="开";
                startitem["showapplist"]="on";
                parent.$("#mos-menu .list").show();
            }else{
                $("#showapplisttext")[0]["innerText"]="关";
                startitem["showapplist"]="off";
                parent.$("#mos-menu .list").hide();
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存
        });
        //在"开始"菜单中显示磁贴
        if(startitem["showblocks"]=="on"){
            $("#showblocks").attr("checked",true);
            $("#showblockstext")[0]["innerText"]="开";
        }
        $("#showblocks").click(function (){
            if($("#showblocks")[0]["checked"]){
                $("#showblockstext")[0]["innerText"]="开";
                startitem["showblocks"]="on";
                parent.$("#mos-menu .blocks").show(); 
            }else{
                $("#showblockstext")[0]["innerText"]="关";
                startitem["showblocks"]="off";
                parent.$("#mos-menu .blocks").hide();
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存
        });
        //显示最近添加的应用
        if(startitem["shownearestapp"]=="on"){
            $("#shownearestapp").attr("checked",true);
            $("#shownearestapptext")[0]["innerText"]="开";
        }
        $("#shownearestapp").click(function (){
            if($("#shownearestapp")[0]["checked"]){
                $("#shownearestapptext")[0]["innerText"]="开";
                startitem["shownearestapp"]="on";
                parent.$("#mos-menu .list .nearestapp").show();
            }else{
                $("#shownearestapptext")[0]["innerText"]="关";
                startitem["shownearestapp"]="off";
                parent.$("#mos-menu .list .nearestapp").hide();
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存
        });
        //显示最常用的应用
        if(startitem["showfusedapp"]=="on"){
            $("#showfusedapp").attr("checked",true);
            $("#showfusedapptext")[0]["innerText"]="开";
        }
        $("#showfusedapp").click(function (){
            if($("#showfusedapp")[0]["checked"]){
                $("#showfusedapptext")[0]["innerText"]="开";
                startitem["showfusedapp"]="on";
                parent.$("#mos-menu .list .fusedapp").show();
            }else{
                $("#showfusedapptext")[0]["innerText"]="关";
                startitem["showfusedapp"]="off";
                parent.$("#mos-menu .list .fusedapp").hide();
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存
        });
        //使用全屏"开始"屏幕
        if(startitem["showfscreen"]=="on"){
            $("#showfscreen").attr("checked",true);
            $("#showfscreentext")[0]["innerText"]="开";
        }
        $("#showfscreen").click(function (){
            if($("#showfscreen")[0]["checked"]){
                $("#showfscreentext")[0]["innerText"]="开";
                startitem["showfscreen"]="on";
            }else{
                $("#showfscreentext")[0]["innerText"]="关";
                startitem["showfscreen"]="off";
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存
        });
        //左边条应用显示
        //显示设置
        if(startitem["showsetup"]=="on"){
            $("#showsetup").attr("checked",true);
            $("#showsetuptext")[0]["innerText"]="开";
        }
        $("#showsetup").click(function (){
            if($("#showsetup")[0]["checked"]){
                $("#showsetuptext")[0]["innerText"]="开";
                startitem["showsetup"]="on";
                mosparent._userdesktopDataSet["sideleft"][1]["show"]="true";
            }else{
                $("#showsetuptext")[0]["innerText"]="关";
                startitem["showsetup"]="off";
                mosparent._userdesktopDataSet["sideleft"][1]["show"]="false";
            }
            mosparent.setsideleft();
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
        });
        //显示文件资源管理器
        if(startitem["showfilemanage"]=="on"){
            $("#showfilemanage").attr("checked",true);
            $("#showfilemanagetext")[0]["innerText"]="开";
        }
        $("#showfilemanage").click(function (){
            if($("#showfilemanage")[0]["checked"]){
                $("#showfilemanagetext")[0]["innerText"]="开";
                startitem["showfilemanage"]="on";
                mosparent._userdesktopDataSet["sideleft"][2]["show"]="true";
            }else{
                $("#showfilemanagetext")[0]["innerText"]="关";
                startitem["showfilemanage"]="off";
                mosparent._userdesktopDataSet["sideleft"][2]["show"]="false";
            }
            mosparent.setsideleft();
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
        });
        //显示个人文件夹
        if(startitem["showpfile"]=="on"){
            $("#showpfile").attr("checked",true);
            $("#showpfiletext")[0]["innerText"]="开";
        }
        $("#showpfile").click(function (){
            if($("#showpfile")[0]["checked"]){
                $("#showpfiletext")[0]["innerText"]="开";
                startitem["showpfile"]="on";
                mosparent._userdesktopDataSet["sideleft"][3]["show"]="true";
            }else{
                $("#showpfiletext")[0]["innerText"]="关";
                startitem["showpfile"]="off";
                mosparent._userdesktopDataSet["sideleft"][3]["show"]="false";
            }
            mosparent.setsideleft();
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
        });
        //显示网络
        if(startitem["shownet"]=="on"){
            $("#shownet").attr("checked",true);
            $("#shownettext")[0]["innerText"]="开";
        }
        $("#shownet").click(function (){
            if($("#shownet")[0]["checked"]){
                $("#shownettext")[0]["innerText"]="开";
                startitem["shownet"]="on";
                mosparent._userdesktopDataSet["sideleft"][4]["show"]="true";
            }else{
                $("#shownettext")[0]["innerText"]="关";
                startitem["shownet"]="off";
                mosparent._userdesktopDataSet["sideleft"][4]["show"]="false";
            }
            mosparent.setsideleft();
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
        });
        //显示视频
        if(startitem["showvideo"]=="on"){
            $("#showvideo").attr("checked",true);
            $("#showvideotext")[0]["innerText"]="开";
        }
        $("#showvideo").click(function (){
            if($("#showvideo")[0]["checked"]){
                $("#showvideotext")[0]["innerText"]="开";
                startitem["showvideo"]="on";
                mosparent._userdesktopDataSet["sideleft"][5]["show"]="true";
            }else{
                $("#showvideotext")[0]["innerText"]="关";
                startitem["showvideo"]="off";
                mosparent._userdesktopDataSet["sideleft"][5]["show"]="false";
            }
            mosparent.setsideleft();
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
        });
        //显示图片
        if(startitem["showpic"]=="on"){
            $("#showpic").attr("checked",true);
            $("#showpictext")[0]["innerText"]="开";
        }
        $("#showpic").click(function (){
            if($("#showpic")[0]["checked"]){
                $("#showpictext")[0]["innerText"]="开";
                startitem["showpic"]="on";
                mosparent._userdesktopDataSet["sideleft"][6]["show"]="true";
            }else{
                $("#showpictext")[0]["innerText"]="关";
                startitem["showpic"]="off";
                mosparent._userdesktopDataSet["sideleft"][6]["show"]="false";
            }
            mosparent.setsideleft();
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
        });
        //显示音乐
        if(startitem["showmusic"]=="on"){
            $("#showmusic").attr("checked",true);
            $("#showmusictext")[0]["innerText"]="开";
        }
        $("#showmusic").click(function (){
            if($("#showmusic")[0]["checked"]){
                $("#showmusictext")[0]["innerText"]="开";
                startitem["showmusic"]="on";
                mosparent._userdesktopDataSet["sideleft"][7]["show"]="true";
            }else{
                $("#showmusictext")[0]["innerText"]="关";
                startitem["showmusic"]="off";
                mosparent._userdesktopDataSet["sideleft"][7]["show"]="false";
            }
            mosparent.setsideleft();
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
        });
        //显示下载
        if(startitem["showdownload"]=="on"){
            $("#showdownload").attr("checked",true);
            $("#showdownloadtext")[0]["innerText"]="开";
        }
        $("#showdownload").click(function (){
            if($("#showdownload")[0]["checked"]){
                $("#showdownloadtext")[0]["innerText"]="开";
                startitem["showdownload"]="on";
                mosparent._userdesktopDataSet["sideleft"][8]["show"]="true";
            }else{
                $("#showdownloadtext")[0]["innerText"]="关";
                startitem["showdownload"]="off";
                mosparent._userdesktopDataSet["sideleft"][8]["show"]="false";
            }
            mosparent.setsideleft();
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
        });
        //显示文档
        if(startitem["showfile"]=="on"){
            $("#showfile").attr("checked",true);
            $("#showfiletext")[0]["innerText"]="开";
        }
        $("#showfile").click(function (){
            if($("#showfile")[0]["checked"]){
                $("#showfiletext")[0]["innerText"]="开";
                startitem["showfile"]="on";
                mosparent._userdesktopDataSet["sideleft"][9]["show"]="true";
            }else{
                $("#showfiletext")[0]["innerText"]="关";
                startitem["showfile"]="off";
                mosparent._userdesktopDataSet["sideleft"][9]["show"]="false";
            }
            mosparent.setsideleft();
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
        });
    };
    function taskbar(item){//任务栏设置
        var taskbaritem=item["item"];
        $(".setrighttop").empty().append("<span class=\"setrtitle\">"+item["title"]+"</span>");
        $("#taskbarposition").val(taskbaritem["taskbarposition"]);
        //锁定任务栏
        if(taskbaritem["locktaskbar"]=="on"){
            $("#locktaskbar").attr("checked",true);
            $("#locktaskbartext")[0]["innerText"]="开";
        }
        $("#locktaskbar").click(function (){
            if($("#locktaskbar")[0]["checked"]){
                $("#locktaskbartext")[0]["innerText"]="开";
                taskbaritem["locktaskbar"]="on";
                
            }else{
                $("#locktaskbartext")[0]["innerText"]="关";
                taskbaritem["locktaskbar"]="off";
                
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
        });
        //自动隐藏任务栏
        if(taskbaritem["hidetaskbar"]=="on"){
            $("#hidetaskbar").attr("checked",true);
            $("#hidetaskbartext")[0]["innerText"]="开";
        }
        $("#hidetaskbar").click(function (){
            if($("#hidetaskbar")[0]["checked"]){
                $("#hidetaskbartext")[0]["innerText"]="开";
                taskbaritem["hidetaskbar"]="on";
                
            }else{
                $("#hidetaskbartext")[0]["innerText"]="关";
                taskbaritem["hidetaskbar"]="off";
                
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
        });
        //任务栏在屏幕上的位置
        $("#taskbarposition").val(taskbaritem["taskbarposition"]);
        $("#taskbarposition").change(function(){//位置改变
            taskbaritem["taskbarposition"]=$("#taskbarposition").val();
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存
            //根据位置变换相应css
            
        });
        var shownum=Number(mosparent._userdesktopDataSet["grouprightshownumber"]);
        //操作中心系统图标显示
        if(taskbaritem["taskbarcommand"]=="on"){
            $("#taskbarcommand").attr("checked",true);
            $("#taskbarcommandtext")[0]["innerText"]="开";
        }
        $("#taskbarcommand").click(function (){
            if($("#taskbarcommand")[0]["checked"]){
                $("#taskbarcommandtext")[0]["innerText"]="开";
                taskbaritem["taskbarcommand"]="on";
                mosparent._userdesktopDataSet["groupright"][0]["show"]="true";
                shownum+=1;
                mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
            }else{
                $("#taskbarcommandtext")[0]["innerText"]="关";
                taskbaritem["taskbarcommand"]="off";
                mosparent._userdesktopDataSet["groupright"][0]["show"]="false";
                shownum-=1;
                mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
            mosparent.settaskbarright();
        });
        //时钟系统图标显示
        if(taskbaritem["taskbarclock"]=="on"){
            $("#taskbarclock").attr("checked",true);
            $("#taskbarclocktext")[0]["innerText"]="开";
        }
        $("#taskbarclock").click(function (){
            if($("#taskbarclock")[0]["checked"]){
                $("#taskbarclocktext")[0]["innerText"]="开";
                taskbaritem["taskbarclock"]="on";
                mosparent._userdesktopDataSet["groupright"][1]["show"]="true";
                shownum+=1;
                mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
            }else{
                $("#taskbarclocktext")[0]["innerText"]="关";
                taskbaritem["taskbarclock"]="off";
                mosparent._userdesktopDataSet["groupright"][1]["show"]="false";
                shownum-=1;
                mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
            mosparent.settaskbarright();
        });
        //输入指示系统图标显示
        if(taskbaritem["taskbarime"]=="on"){
            $("#taskbarime").attr("checked",true);
            $("#taskbarimetext")[0]["innerText"]="开";
        }
        $("#taskbarime").click(function (){
            if($("#taskbarime")[0]["checked"]){
                $("#taskbarimetext")[0]["innerText"]="开";
                taskbaritem["taskbarime"]="on";
                mosparent._userdesktopDataSet["groupright"][2]["show"]="true";
                shownum+=1;
                mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
            }else{
                $("#taskbarimetext")[0]["innerText"]="关";
                taskbaritem["taskbarime"]="off";
                mosparent._userdesktopDataSet["groupright"][2]["show"]="false";
                shownum-=1;
                mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
            mosparent.settaskbarright();
        });
        //音量系统图标显示
        if(taskbaritem["taskbarvolume"]=="on"){
            $("#taskbarvolume").attr("checked",true);
            $("#taskbarvolumetext")[0]["innerText"]="开";
        }
        $("#taskbarvolume").click(function (){
            if($("#taskbarvolume")[0]["checked"]){
                $("#taskbarvolumetext")[0]["innerText"]="开";
                taskbaritem["taskbarvolume"]="on";
                mosparent._userdesktopDataSet["groupright"][3]["show"]="true";
                shownum+=1;
                mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
            }else{
                $("#taskbarvolumetext")[0]["innerText"]="关";
                taskbaritem["taskbarvolume"]="off";
                mosparent._userdesktopDataSet["groupright"][3]["show"]="false";
                shownum-=1;
                mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
            mosparent.settaskbarright();
        });
        //网络系统图标显示
        if(taskbaritem["taskbarnet"]=="on"){
            $("#taskbarnet").attr("checked",true);
            $("#taskbarnettext")[0]["innerText"]="开";
        }
        $("#taskbarnet").click(function (){
            if($("#taskbarnet")[0]["checked"]){
                $("#taskbarnettext")[0]["innerText"]="开";
                taskbaritem["taskbarnet"]="on";
                mosparent._userdesktopDataSet["groupright"][4]["show"]="true";
                shownum+=1;
                mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
            }else{
                $("#taskbarnettext")[0]["innerText"]="关";
                taskbaritem["taskbarnet"]="off";
                mosparent._userdesktopDataSet["groupright"][4]["show"]="false";
                shownum-=1;
                mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
            mosparent.settaskbarright();
        });
        //触摸键盘系统图标显示
        if(taskbaritem["taskbarkeyboard"]=="on"){
            $("#taskbarkeyboard").attr("checked",true);
            $("#taskbarkeyboardtext")[0]["innerText"]="开";
        }
        
        $("#taskbarkeyboard").click(function (){
            if($("#taskbarkeyboard")[0]["checked"]){
                $("#taskbarkeyboardtext")[0]["innerText"]="开";
                taskbaritem["taskbarkeyboard"]="on";
                mosparent._userdesktopDataSet["groupright"][6]["show"]="true";
                shownum+=1;
                mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
            }else{
                $("#taskbarkeyboardtext")[0]["innerText"]="关";
                taskbaritem["taskbarkeyboard"]="off";
                mosparent._userdesktopDataSet["groupright"][6]["show"]="false";
                shownum-=1;
                mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
            mosparent.settaskbarright();
        });
        //触摸板系统图标显示
        if(taskbaritem["taskbartouchpad"]=="on"){
            $("#taskbartouchpad").attr("checked",true);
            $("#taskbartouchpadtext")[0]["innerText"]="开";
        }
        $("#taskbartouchpad").click(function (){
            if($("#taskbartouchpad")[0]["checked"]){
                $("#taskbartouchpadtext")[0]["innerText"]="开";
                taskbaritem["taskbartouchpad"]="on";
                mosparent._userdesktopDataSet["groupright"][7]["show"]="true";
                shownum+=1;
                mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
            }else{
                $("#taskbartouchpadtext")[0]["innerText"]="关";
                taskbaritem["taskbartouchpad"]="off";
                mosparent._userdesktopDataSet["groupright"][7]["show"]="false";
                shownum-=1;
                mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
            mosparent.settaskbarright();
        });
        //定位系统图标显示
        if(taskbaritem["taskbarlocation"]=="on"){
            $("#taskbarlocation").attr("checked",true);
            $("#taskbarlocationtext")[0]["innerText"]="开";
        }
        $("#taskbarlocation").click(function (){
            if($("#taskbarlocation")[0]["checked"]){
                $("#taskbarlocationtext")[0]["innerText"]="开";
                taskbaritem["taskbarlocation"]="on";
                mosparent._userdesktopDataSet["groupright"][8]["show"]="true";
                shownum+=1;
                mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
            }else{
                $("#taskbarlocationtext")[0]["innerText"]="关";
                taskbaritem["taskbarlocation"]="off";
                mosparent._userdesktopDataSet["groupright"][8]["show"]="false";
                shownum-=1;
                mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
            mosparent.settaskbarright();
        });
        //应用图标显示
        var idset=[];
        if(mosparent._userdesktopDataSet["groupright"].length>9){
            for(var i=9;i<mosparent._userdesktopDataSet["groupright"].length;i++){
                var id=mosparent._userdesktopDataSet["groupright"][i]["id"].replace(/mos-/, "");
                idset.push(id);
                if(id in taskbaritem){}else{taskbaritem[id]="off";}
            }
            $.each(idset,function(index,value){
                if(taskbaritem[idset[index]]=="on"){
                    $("#"+idset[index]).attr("checked",true);
                    $("#"+idset[index]+"text")[0]["innerText"]="开";
                }
                $("#"+idset[index]).click(function (){
                    if($("#"+idset[index])[0]["checked"]){
                        $("#"+idset[index]+"text")[0]["innerText"]="开";
                        taskbaritem[idset[index]]="on";
                        mosparent._userdesktopDataSet["groupright"][index+9]["show"]="true";
                        shownum+=1;
                        mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
                    }else{
                        $("#"+idset[index]+"text")[0]["innerText"]="关";
                        taskbaritem[idset[index]]="off";
                        mosparent._userdesktopDataSet["groupright"][index+9]["show"]="false";
                        shownum-=1;
                        mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;
                    }
                    mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
                    mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
                    mosparent.settaskbarright();
                });
            });
        }
        //显示所有应用图标
        if(taskbaritem["taskbarshowallappicon"]=="on"){
            $("#taskbarshowallappicon").attr("checked",true);
            $("#taskbarshowallappicontext")[0]["innerText"]="开";
        }
        $("#taskbarshowallappicon").click(function (){
            if($("#taskbarshowallappicon")[0]["checked"]){
                $("#taskbarshowallappicontext")[0]["innerText"]="开";
                taskbaritem["taskbarshowallappicon"]="on";
                if(idset.length>0){
                    $.each(idset,function(index,value){
                        taskbaritem[idset[index]]="on";
                        mosparent._userdesktopDataSet["groupright"][index+9]["show"]="true";
                        shownum+=1;
                        mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;    
                    });
                }
            }else{
                $("#taskbarshowallappicontext")[0]["innerText"]="关";
                taskbaritem["taskbarshowallappicon"]="off";
                if(idset.length>0){
                    $.each(idset,function(index,value){
                        taskbaritem[idset[index]]="off";
                        mosparent._userdesktopDataSet["groupright"][index+9]["show"]="false";
                        shownum+=1;
                        mosparent._userdesktopDataSet["grouprightshownumber"]=""+shownum;    
                    });
                }  
            }
            mosparent.saveusersetup(username,mosparent._usersetupDataSet);//实时保存-设置
            mosparent.savedesktop(username,mosparent._userdesktopDataSet);//实时保存-桌面
            mosparent.settaskbarright();
        });
    };
</script>
</html>
