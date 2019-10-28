/************字符雨动态壁纸**********
* 1.桌面场景追加元素
* 2.清除公共或特定定时器
* 3.背景设置中预览窗口追加元素--暂时不用
* 4.追加元素宽高的设定
* 5.实施动态细节
***********************************/
if(mos._dynamicdesktopwallpaperid!=="" && $("#mos-desktop-scene").length>0){
    //1.清除公共或特定定时器
    if(mos._publicIntervalTimer!==null){clearInterval(mos._publicIntervalTimer);}
    //2.桌面场景追加元素
    $("#mos-desktop-scene").empty().append($('<canvas id="desktop-character-rain"></canvas>'));
    //4.追加元素宽高的设定
    var desktop = document.getElementById("desktop-character-rain");
    var desktopctx = desktop.getContext("2d");
    desktop.height = window.innerHeight;
    desktop.width = window.innerWidth;
    //5.实施动态细节
    dynamic(desktopctx,desktop.height,desktop.width,"desktop");
}
function dynamic(ctx,Dheight,Dwidth,position){
    //binary characters - taken from the unicode charset
    var binary = "ABCDEFGHIJ我爱你中国KLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    //converting the string into an array of single characters
    binary = binary.split("");
    var font_size = 13;//字体大小
    var columns = Dwidth/font_size; //number of columns for the rain
    //an array of drops - one per column
    var drops = [];
    //x below is the x coordinate
    //1 = y co-ordinate of the drop(same for every drop initially)
    for(var x = 0; x < columns; x++)
        drops[x] = 1;
    //drawing the characters
    function draw()
    {
        //Black BG for the canvas
        //translucent BG to show trail
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, Dwidth, Dheight);
        ctx.fillStyle = "#0F0"; //green text
        ctx.font = font_size + "px arial";
        //looping over drops
        for(var i = 0; i < drops.length; i++)
        {
            //a random character to print
            var text = binary[Math.floor(Math.random()*binary.length)];
            //x = i*font_size, y = value of drops[i]*font_size
            ctx.fillText(text, i*font_size, drops[i]*font_size);

            //sending the drop back to the top randomly after it has crossed the screen
            //adding a randomness to the reset to make the drops scattered on the Y axis
            if(drops[i]*font_size > Dheight && Math.random() > 0.975)
                drops[i] = 0;
            //incrementing Y coordinate
            drops[i]++;
        }
    }
    if (position=="desktop"){mos._publicIntervalTimer=setInterval(draw, 70);}//设置速度
    if (position=="set"){mos._setIntervalTimer=setInterval(draw, 70);}//设置速度
};
