/************张可儿-让我走进你心里动态壁纸*********
* 1.清除公共或特定定时器
* 2.桌面场景追加元素
***********************************/
if(mos._dynamicdesktopwallpaperid!=="" && $("#mos-desktop-scene").length>0){
    //1.清除公共或特定定时器
    if(mos._publicIntervalTimer!==null){clearInterval(mos._publicIntervalTimer);}
    //2.桌面场景追加元素
    $("#mos-desktop-scene").empty().append($('<video style="width:'+window.innerWidth+'px;height:'+window.innerHeight+'px;background-color: #010001;" autoplay loop <source src="'+mos._RootPath+'core/media/张可儿－请你让我走进你眼里.mp4" type="video/mp4">您的浏览器不支持HTML5的video标签。</video>'));//--autoplay后可加 loop-->
}
